### IMPORTS ###

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from dotenv import load_dotenv
import os 
load_dotenv()

class ChatBot:
    def __init__(self, cheat_sheet, vector_store):
        self.cheat_sheet = cheat_sheet
        self.vector_store = vector_store
        self.create_rag_chain()
    
    def create_rag_chain(self):
        retriever = self.vector_store.as_retriever(
            search_type = 'similarity',
            search_kwargs = {"k":3}
        )
        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, just "
            "reformulate it if needed and otherwise return it as is."
        )

        contextualize_q_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", contextualize_q_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )

        llm = ChatGroq(model = 'mixtral-8x7b-32768', groq_api_key = os.getenv("ARMAN_GROQ_API_KEY"))

        history_aware_retriever = create_history_aware_retriever(
            llm , retriever, contextualize_q_prompt
        )

        qa_system_prompt = (
            "You are an expert educational assistant for question-answering tasks. Use "
            "the following pieces of retrieved context as primary reference to answer the "
            "question. You may use your own domain knowledge to add additional information"
            "about the topic."
            "Additionally, make sure to give examples and explain the reasoning to"
            "keep the conversation engaging."
            "\n\n"
            "{context}"
        )
        qa_prompt = ChatPromptTemplate.from_messages(
                    [
                ("system", qa_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )
        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

        self.rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

        self.chat_history = []

        self.chat_history.append(HumanMessage(content = "Please generate a cheat sheet based on the document uploaded."))
        self.chat_history.append(AIMessage(content = self.cheat_sheet))

    def invoke(self, query):
        response = self.rag_chain.invoke({
            "chat_history": self.chat_history,
            "input": query
        })
        self.chat_history.append(HumanMessage(content = query))
        self.chat_history.append(AIMessage(content = response['answer']))
        return response['answer']











