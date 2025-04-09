from dotenv import load_dotenv
from fastapi import status
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from agents import StoreCheatSheet
from agents import StudyGuide
from agents import Quiz
from agents import Translate
from chatbot import ChatBot
import dataingestion
import agents
import json
import re
import googleapiclient.discovery
import os
load_dotenv()
google_api=os.getenv("MY_API_KEY") # 🔹 Replace with your actual API key
topic_wise_output = None
def search_youtube(search_query : str):
    api_service_name = "youtube"
    api_version = "v3"

    youtube = googleapiclient.discovery.build(api_service_name, api_version, developerKey=google_api)

    request = youtube.search().list(
        part="id",
        q=search_query,
        type="video",
        maxResults=1
    )

    response = request.execute()
    return response

app = FastAPI()

# Add CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://drona-three.vercel.app/"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/upload")
def upload(web_url: str = None, yt_url: str = None,file_path:str = None,lang:str = None):
    global lang_select
    lang_select = lang
    if (web_url==None and yt_url==None and file_path==None):
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "At least one parameter is required: web_url, yt_url, or file_path"})
    
    data = dataingestion.DataIngestion(web_url=web_url,yt_url=yt_url,file_path=file_path)
    global study_data
    study_data = data.document_content
    global document_db
    document_db = data.vectorStore
    cheat_data = agents.CheatSheet(study_content=study_data)
    cheat_sheet = cheat_data.main_generate_cheat_sheet()
    global cheat_sheet_db
    cheat_sheet_db = StoreCheatSheet(cheat_sheet=cheat_sheet)
    cheat_sheet_db.setup_db()
    global chat_obj
    chat_obj = ChatBot(cheat_sheet=cheat_sheet, vector_store=document_db)
    topic_data = agents.Topics(cheat_sheet=cheat_sheet)
    result = topic_data.generate_topics()

    if hasattr(result, "content"):
        topic_output = result.content
    else:
        topic_output = str(result)

    match = re.search(r'```json\s*\n(.*?)\n```', topic_output, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
    else:
        start = topic_output.find('{')
        end = topic_output.rfind('}')
        if start != -1 and end != -1:
            json_str = topic_output[start:end+1]
        else:
            json_str = "{}"

    try:
        topic_dict = json.loads(json_str)
    except json.JSONDecodeError as e:
        print("JSON decoding failed:", e)
        topic_dict = {}
    global topic_dictionary
    topic_dictionary = eval(str(topic_dict))
    topics = list(topic_dict.get("topics", {}).keys())
    if lang_select != None:
        global obj
        obj = Translate(lang=lang)
        cheat_sheet = obj.generate_translation(input=cheat_sheet)
    return {"topics": topics, "cheet_sheet": str(cheat_sheet)}

@app.get("/study")
def study():
     ### now initiating topic wise study guide
    global cheat_sheet_db
    global topic_dictionary 
    global topic_wise_output
    topic_wise_study_guide = {}
    for key in topic_dictionary['topics']:
        parsed_topic_and_subtopics = f"The main topic is {key} and subtopics are {topic_dictionary['topics'][key]}"
        topic_wise_study_guide[key] = StudyGuide(topic = parsed_topic_and_subtopics, vector_store = cheat_sheet_db.vector_store)
    topic_wise_output = {}
    for i,key in enumerate(topic_wise_study_guide):
        search_query = str(key)
        response = search_youtube(search_query)
        if "items" in response and len(response["items"]) > 0:
            top_video_id = response["items"][0]["id"]["videoId"]
        else:
            print("No results found.")
        topic_wise_output[key] = {"summary":obj.generate_translation(input=topic_wise_study_guide[key].get_topic_wise_study_content()) if lang_select is not None else topic_wise_study_guide[key].get_topic_wise_study_content(),"youtube":top_video_id}
        print(i,"Done")
    return {"study": topic_wise_output}

@app.get("/quiz")
def quiz(topic : str):
    topic = topic_wise_output[topic]["summary"]
    quiz_obj = Quiz(topic_summary = topic)
    quiz = quiz_obj.generate_quiz()
    quiz_data = quiz.content
    
    match = re.search(r'```json\s*\n(.*?)\n```', quiz_data, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
    else:
        start = quiz_data.find('{')
        end = quiz_data.rfind('}')
        if start != -1 and end != -1:
            json_str = quiz_data[start:end+1]
        else:
            json_str = "{}"
            
    quiz_dict = eval(json_str)
    return {"quiz" : quiz_dict}

@app.get("/chat")
def chat(query : str):
    response = chat_obj.invoke(query=str(query))
    return {'response' : response }
