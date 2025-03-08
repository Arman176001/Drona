from langchain_community.document_loaders import PyPDFLoader, YoutubeLoader
from langchain_chroma import Chroma 
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import FireCrawlLoader
from dotenv import load_dotenv
from typing import List, Type, Tuple
from xml.dom.minidom import Document

import os  

load_dotenv()
os.environ["GOOGLE_API_KEY"]=os.getenv("GOOGLE_API_KEY")

firecrawl_api_key = os.getenv("FIRECRAWL_API_KEY")

class DataIngestion:

    def __init__(self, web_url = None, yt_url = None, file_path = None):
        self.web_url = web_url
        self.yt_url = yt_url
        self.file_path = file_path
        self.docs = None
        self.document_content = "" # will be sent to llm for cheat sheet creation
        ## persistent directory for chroma db
        self.persist_directory = "db"
        self.vectorstore = None
        self.ingest_data()

    def filter_complex_metadata(self,
        documents: List[Document],
        *,
        allowed_types: Tuple[Type, ...] = (str, bool, int, float),
    ) -> List[Document]:
        """Filter out metadata types that are not supported for a vector store."""
        updated_documents = []
        for document in documents:
            filtered_metadata = {}
            for key, value in document.metadata.items():
                if not isinstance(value, allowed_types):
                    continue
                filtered_metadata[key] = value

            document.metadata = filtered_metadata
            updated_documents.append(document)

        return updated_documents

    def ingest_data(self):
        loader = None
        if self.web_url:
            ## ingesting from web page
            loader = FireCrawlLoader(
            api_key=firecrawl_api_key, url = self.web_url, mode = 'scrape'
            )
            self.docs = self.filter_complex_metadata(loader.load())

        elif self.yt_url:
            ## ingesting from youtube video
            loader = YoutubeLoader.from_youtube_url(self.yt_url, add_video_info = False)
            self.docs = loader.load()
        
        elif self.file_path:
            ## ingesting from file
            loader = PyPDFLoader(self.file_path)
            self.docs = loader.load()
        
        self.document_content = " ".join([doc.page_content for doc in self.docs])
        self.setup_db()

    def setup_db(self, chunk_size = 500, chunk_overlap = 100):
        ## setup chroma db
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size = chunk_size, chunk_overlap = chunk_overlap)
        chunks = text_splitter.split_documents(self.docs)
        self.vectorStore = Chroma.from_documents(documents = chunks, embedding = embeddings, persist_directory=self.persist_directory)


        


