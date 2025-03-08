    

##### IMPORTS #####

import os    
from dotenv import load_dotenv
from langchain import hub
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate
from langchain_core.tools import Tool
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.tools import BaseTool, StructuredTool, tool
from pydantic import BaseModel, Field
from typing import List, Dict
from typing import Literal
from langchain_chroma import Chroma  
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.docstore.document import Document  # ✅ Correct import
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_community.tools import DuckDuckGoSearchRun
from langchain.agents import AgentExecutor, create_tool_calling_agent

# loading environment variables
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
os.environ["GOOGLE_API_KEY"]=os.getenv("GOOGLE_API_KEY")



class TopicsOutput(BaseModel):
    topics: Dict[str, List[str]] = Field(description="A dictionary of topics where 'name' is a string and 'subtopics' is a list of related subtopics of that topic.")

class MCQ(BaseModel):
    ques: str
    a: str
    b: str
    c: str
    d: str
    ans: Literal["a", "b", "c", "d"]  # Ensures answer is one of the options

class MCQs(BaseModel):
    questions: List[MCQ]

### Cheat Sheet Class ###

''' 
There will be 2 agents in the CheatSheet class.
1) Main Cheat Sheet agent 
2) Topic wise Cheat Sheet agent
I have initialized the main cheat sheet agent in the __init__ method of the CheatSheet class.
The Topic wise Cheat Sheet agent is pending to be initialized.

'''

class CheatSheet:

    def __init__(self, study_content):
        self.study_content = study_content
        self.cheat_sheet_system_prompt = (
        """You are an expert assistant in generating structured, unified, and concise cheat sheets from multiple sources. Your task is to create a detailed yet brief cheat sheet following these guidelines:

        Focus Areas:
        Fundamental Concepts: Summarize core ideas and principles with a clear introduction.
        Key Mathematical Concepts: Include relevant theories (skip if not applicable).
        Code Snippets & Explanation: Provide essential code examples with brief explanations (only if relevant).
        Critical Definitions: List key terms concisely.
        Important Formulas & Equations: Use proper notation (skip if none exist).
        Algorithms & Key Steps: Outline relevant algorithms and key steps.
        Formatting:
        Bold, large heading for the cheat sheet.
        No additional text (e.g., greetings, disclaimers, or closing statements).
        Clear sections with logical flow.
        Proper Markdown syntax for mathematical notation.
        Concise but thorough explanations, avoiding repetition.
        Output:
        Markdown format.
        800 words."""
        )
        self.initialize_main_cheat_sheet_agent()



    def initialize_main_cheat_sheet_agent(self):
        # Create a ChatGroq instance
        llm = ChatGroq(model = 'llama-3.3-70b-versatile', groq_api_key = os.getenv("MANRAJ_GROQ_API_KEY"))
        # Create a prompt template for answering questions
        cheat_sheet_prompt = ChatPromptTemplate.from_messages(
        [
        ("system", self.cheat_sheet_system_prompt),
        ("human", "Please generate the cheat sheet of the following content: \n {input}"),
        ]
        )

        rag_chain = cheat_sheet_prompt | llm | StrOutputParser()

        # Load the ReAct Docstore Prompt
        react_docstore_prompt = hub.pull("hwchase17/react")
        # creating tools
        tools = [
            StructuredTool.from_function(
                name = 'Generate CheatSheet',
                func = lambda input, **kwargs: rag_chain.invoke(
                    {"input": input}
                ),
                description = "Useful for creating concise cheat sheets from given content.",
                return_direct = True
            )
        ]
        #initializing agent
        
        agent = create_react_agent(
            llm = llm, 
            tools = tools,
            prompt = react_docstore_prompt
        )

        self.main_agent_executor = AgentExecutor.from_agent_and_tools(
            agent = agent, tools = tools, handling_parsing_errors = True, verbose = True,
        )


    def main_generate_cheat_sheet(self):
        response = self.main_agent_executor.invoke({"input": self.study_content})
        return response['output']


#### For Topic Wise Content ####

'''
    Idea is to use main cheat sheet embeddings as vector database and have 2 agents working autonomously 
    to interact with one another inorder to create topic wise study content/guide.

    1) Retrieval Chain that retrieves the relevant context from cheat sheet and returns it 
    2) Internet Search agent that searches the internet for more information on the topic and returns it
    3) Combine both the results to ensure context and if context is not enough then internet source compensates for it.


'''


## persist directory for chroma db (currently local may switch to cassandra db or qdrant in future)

current_dir = os.path.dirname(os.path.abspath(__file__))
db_dir = os.path.join(current_dir,"db")
persistent_directory = os.path.join(db_dir,"chroma_db_for_main_cheatsheet")

class StoreCheatSheet:

    def __init__(self, cheat_sheet, persistent_directory = persistent_directory):
        self.cheat_sheet = cheat_sheet
        self.persistent_directory = persistent_directory
    
    def setup_db(self):
        embeddings = GoogleGenerativeAIEmbeddings(model = 'models/embedding-001')
        text_splitter = RecursiveCharacterTextSplitter(chunk_size = 400, chunk_overlap = 20)
        chunks = text_splitter.split_text(self.cheat_sheet)
        documents = [Document(page_content=chunk) for chunk in chunks]
        self.vector_store = Chroma.from_documents(embedding=embeddings, documents=documents, persist_directory=self.persistent_directory)


class StudyGuide:
    
    def __init__(self, topic, vector_store):
        self.topic = topic  # Instance-specific topic
        self.vector_store = vector_store # vector database for cheat sheet
        
    def get_document_relevant_response(self):
        llm = ChatGroq(model = 'llama-3.3-70b-versatile', groq_api_key = os.getenv('MANRAJ_GROQ_API_KEY'))
        
        topic_wise_cheat_sheet_prompt = '''
        You are an expert educational assistant. Your task is to generate **detailed, well-structured study material** using the provided context as a primary reference.  

        ### **Instructions:**  
        - Use the given context as a foundation, but feel free to enhance explanations with relevant background knowledge, examples, and analogies.  
        - Ensure **clarity, logical flow, and structured formatting** with headings and subheadings.  
        - Keep explanations **informative and engaging** while maintaining factual accuracy.  
        - **No introductions, disclaimers, or conclusions.**  
        - Output should be **around 500 words.**  

        ### **Context:**  
        <context>  
        {context}  
        </context>  

        Generate the study material based on this.

    '''

        final_topic_wise_prompt = ChatPromptTemplate.from_template(
            topic_wise_cheat_sheet_prompt
        )

        document_chain = create_stuff_documents_chain(llm, final_topic_wise_prompt)
        retriever = self.vector_store.as_retriever(
            search_type = 'similarity',
            search_kwargs = {"k": 3}
        )

        retrieval_chain = create_retrieval_chain(retriever, document_chain)
        response = retrieval_chain.invoke({"input": self.topic})
        return response['answer']

            
    def combine_responses(self):
        document_response = self.get_document_relevant_response()
        # internet_response = self.get_internet_response()
        combine_results_prompt = '''
            You are an expert educational assistant. Your task is to generate **detailed, well-structured study material** using the provided context and topic as a primary reference.
            <context>
            {context}
            </context>
            <topic>
            {topic}
            </topic>
            Generate the study material based on this.
            Guidelines for the study material:
            - Use the given context and internet response as foundations.
            - Enhance explanations with relevant background knowledge, examples, and analogies.
            - Ensure clarity, logical flow, and structured formatting with headings and subheadings.
            - Keep explanations informative and engaging while maintaining factual accuracy.
            - No introductions, disclaimers, or conclusions.
            - Output should be around 800 words.

        '''
        llm = ChatGroq(model = 'llama-3.3-70b-versatile', groq_api_key = os.getenv("MANRAJ_GROQ_API_KEY"))  
        final_topic_wise_prompt = ChatPromptTemplate.from_template(
            combine_results_prompt
        )
        chain = final_topic_wise_prompt | llm | StrOutputParser()
        response = chain.invoke({"context":document_response, "topic":self.topic})
        return response 
    
    def get_topic_wise_study_content(self):
        return self.combine_responses()

    

'''
#### disclaimer :
    The topic should be parsed and converted to string before initializing the StudyGuide class

'''


    
## Pydantic for the Topic wise Cheat Sheet agent
class TopicsOutput(BaseModel):
    topics: Dict[str, List[str]] = Field(description="A dictionary of topics where 'name' is a string and 'subtopics' is a list of related subtopics of that topic.")



### Topics Class ###

class Topics:
    
    def __init__(self, cheat_sheet):
        self.cheat_sheet = cheat_sheet
        response_schemas = [
            ResponseSchema(name="topics", description="A dictionary where each key is an important topic and the value is a list of related subtopics.")
        ]

    # Create the parser
        parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = parser.get_format_instructions()
        self.prompt = PromptTemplate(
                template="""
            Identify and extract key topics and their related subtopics from the given study material. 

            - The topics should be specific terms/concepts that the study material is focused on, rather than generic headings like "Key Concepts" or "Mathematical Concepts".
            - The subtopics should be extracted only if the study material provides sufficient detail about them, rather than just a passing mention.
            - Ensure that each topic is derived from the underlying subject matter and terminology used in the content.
            - Return the output in JSON format as per the given structure:

            {format_instructions}

            Study Material:
            {study_material}
            """,
            input_variables=["study_material"],
            partial_variables={"format_instructions": format_instructions},
        )
        self.llm = ChatGroq(model = 'llama-3.3-70b-versatile', groq_api_key = os.getenv("KAVYA_GROQ_API_KEY"))
        # Generate response
        self.formatted_prompt = self.prompt.format(study_material=self.cheat_sheet)

    def generate_topics(self):
        response = self.llm.invoke(self.formatted_prompt)
        return response



class Quiz:
    def __init__(self, topic_summary):
        self.topic_summary = topic_summary
        response_schemas = [
            ResponseSchema(name="Questions", description="A collection of multiple-choice questions (MCQs), where each question includes four options (a, b, c, d) and a correct answer.")
        ]

        parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = parser.get_format_instructions()
        self.quiz_prompt = PromptTemplate(
            template = """You are a helpful assistant with deep knowledge of the given topic. Your task is to generate multiple-choice questions (MCQs) based on a list of keywords and a given passage. Use your domain knowledge of the subject to create at least 10 and at most 20 diverse and challenging MCQs.
                Each question should:

                Be informative and test both foundational and deep knowledge of the topic.
                Have clear and concise wording with four answer choices labeled as (a, b, c, d).
                Vary in difficulty level, including a mix of conceptual, theoretical, and application-based questions.
                Ensure the correct answer is precisely indicated.
                - Return the output in JSON format as per the given structure:

                {format_instructions}  
                Summary of the topic:
                {topic_summary}  
                """,
            input_variables=["topic_summary"],
            partial_variables={"format_instructions": format_instructions},
        )
        
        self.llm = ChatGroq(model='llama-3.3-70B-versatile',groq_api_key=os.getenv("ARMAN_GROQ_API_KEY"))
        self.formatted_prompt = self.quiz_prompt.format(topic_summary = self.topic_summary)

    def getquiz_with_explanation(self, quiz):
        response_schemas = [
                ResponseSchema(name="Questions", description="A collection of multiple-choice questions (MCQs), where each question includes four options (a, b, c, d) and a correct answer.")
            ]

        parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = parser.get_format_instructions()
        quiz_prompt = PromptTemplate(
        template = """
        You are a helpful assistant tasked with adding explanations to a set of multiple-choice questions.

    Your input is a JSON object containing multiple-choice questions with their options and correct answers.

    Your task is to:
    1. Parse the input JSON
    2. For each question, add a new key called 'explanation' that provides a clear, concise explanation of why the correct answer is right
    3. Return the entire enhanced JSON structure with all original fields preserved plus the new explanation field

    The explanation should:
    - Be 3-4 sentences in length
    - Provide educational value by explaining the underlying concept
    - Reference relevant terminology from the domain
    - Be factually accurate and precise

            {format_instructions}  
            Quiz:
                {quiz}  
            """,
                input_variables=["quiz"],
                partial_variables={"format_instructions": format_instructions},
        )    
        llm = ChatGroq(model='llama-3.3-70B-versatile',groq_api_key=os.getenv("ARMAN_GROQ_API_KEY"))
        formatted_prompt = quiz_prompt.format(quiz = quiz)
        response = llm.invoke(formatted_prompt)
        return response 
        
    def generate_quiz(self):
        response = self.llm.invoke(self.formatted_prompt)
        final_response_with_explanation = self.getquiz_with_explanation(response.content)
        return final_response_with_explanation