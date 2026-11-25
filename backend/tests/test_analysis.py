import pytest
from pydantic import ValidationError
from app.schemas.resume import AnalysisResult
from app.schemas.auth import UserRegister
from app.services.llm_service import _extract_json

valid = dict(candidate_skills=['Python'], required_skills=['Python'], missing_skills=[], learning_suggestions=[], match_score=100)

def test_valid():
    assert AnalysisResult.model_validate(valid).match_score == 100

@pytest.mark.parametrize('score', [-1, 101, 'bad', float('nan')])
def test_invalid_score(score):
    with pytest.raises(ValidationError): AnalysisResult.model_validate({**valid, 'match_score': score})

def test_invalid_skills():
    with pytest.raises(ValidationError): AnalysisResult.model_validate({**valid, 'candidate_skills': 'Python'})

def test_json():
    assert _extract_json('```json\n{"a": 1}\n```') == {'a': 1}

def test_password_bytes():
    with pytest.raises(ValidationError): UserRegister(full_name='Test User', email='test@example.com', password='é'*40)
