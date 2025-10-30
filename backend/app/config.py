"""
Configuration management using pydantic-settings
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    
    # Hugging Face
    hugging_face_api_key: str = ""
    
    # Supabase
    vite_supabase_url: str = ""
    vite_supabase_anon_key: str = ""
    
    # CORS
    frontend_url: str = "http://localhost:8080"
    
    # Model Configuration
    video_model_name: str = "shylhy/videomae-large-finetuned-deepfake-subset"
    image_model_name: str = "prithivMLmods/Deep-Fake-Detector-v2-Model"
    
    # Performance
    max_video_size_mb: int = 100
    max_workers: int = 2
    use_gpu: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance"""
    return Settings()
