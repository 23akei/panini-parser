#!/usr/bin/env python3
"""
Sample Sanskrit word database for the CLI game
"""

from typing import List, Dict, NamedTuple
from enum import Enum
import random


class Difficulty(Enum):
    BEGINNER = 1
    INTERMEDIATE = 2
    ADVANCED = 3
    EXPERT = 4


class SanskritWordData(NamedTuple):
    """Data structure for Sanskrit words"""
    devanagari: str
    iast: str
    meaning: str
    part_of_speech: str
    difficulty: Difficulty
    root: str = ""
    gender: str = ""
    case_info: str = ""
    additional_info: str = ""


class WordDatabase:
    """Sample database of Sanskrit words for learning"""
    
    def __init__(self):
        self.words = self._initialize_words()
    
    def _initialize_words(self) -> List[SanskritWordData]:
        """Initialize with sample Sanskrit words"""
        return [
            # Beginner Level - Basic nouns and common words
            SanskritWordData(
                devanagari="देवः",
                iast="devaḥ",
                meaning="god, deity",
                part_of_speech="noun",
                difficulty=Difficulty.BEGINNER,
                gender="masculine",
                case_info="nominative singular",
                additional_info="a-stem masculine noun"
            ),
            SanskritWordData(
                devanagari="गुरुः",
                iast="guruḥ",
                meaning="teacher, heavy",
                part_of_speech="noun/adjective",
                difficulty=Difficulty.BEGINNER,
                gender="masculine",
                case_info="nominative singular",
                additional_info="u-stem masculine"
            ),
            SanskritWordData(
                devanagari="राजा",
                iast="rājā",
                meaning="king",
                part_of_speech="noun",
                difficulty=Difficulty.BEGINNER,
                gender="masculine",
                case_info="nominative singular",
                additional_info="an-stem masculine"
            ),
            SanskritWordData(
                devanagari="ग्रामः",
                iast="grāmaḥ",
                meaning="village",
                part_of_speech="noun",
                difficulty=Difficulty.BEGINNER,
                gender="masculine",
                case_info="nominative singular",
                additional_info="a-stem masculine"
            ),
            SanskritWordData(
                devanagari="नगरम्",
                iast="nagaram",
                meaning="city",
                part_of_speech="noun",
                difficulty=Difficulty.BEGINNER,
                gender="neuter",
                case_info="nominative/accusative singular",
                additional_info="a-stem neuter"
            ),
            
            # Intermediate Level - Verbs and more complex words
            SanskritWordData(
                devanagari="गच्छति",
                iast="gacchati",
                meaning="goes, walks",
                part_of_speech="verb",
                difficulty=Difficulty.INTERMEDIATE,
                root="गम् (gam)",
                additional_info="3rd person singular present, thematic class (गम्→गच्छ्)"
            ),
            SanskritWordData(
                devanagari="पठति",
                iast="paṭhati",
                meaning="reads, recites",
                part_of_speech="verb",
                difficulty=Difficulty.INTERMEDIATE,
                root="पठ् (paṭh)",
                additional_info="3rd person singular present, thematic class"
            ),
            SanskritWordData(
                devanagari="सुन्दरः",
                iast="sundaraḥ",
                meaning="beautiful",
                part_of_speech="adjective",
                difficulty=Difficulty.INTERMEDIATE,
                gender="masculine",
                case_info="nominative singular",
                additional_info="a-stem adjective"
            ),
            SanskritWordData(
                devanagari="ब्राह्मणः",
                iast="brāhmaṇaḥ",
                meaning="brahmin, priest",
                part_of_speech="noun",
                difficulty=Difficulty.INTERMEDIATE,
                gender="masculine",
                case_info="nominative singular",
                additional_info="a-stem masculine, derived from ब्रह्मन्"
            ),
            SanskritWordData(
                devanagari="शिष्यः",
                iast="śiṣyaḥ",
                meaning="student, disciple",
                part_of_speech="noun",
                difficulty=Difficulty.INTERMEDIATE,
                gender="masculine",
                case_info="nominative singular",
                additional_info="a-stem masculine"
            ),
            
            # Advanced Level - Complex forms and compounds
            SanskritWordData(
                devanagari="देवानाम्",
                iast="devānām",
                meaning="of the gods",
                part_of_speech="noun",
                difficulty=Difficulty.ADVANCED,
                gender="masculine",
                case_info="genitive plural",
                additional_info="a-stem masculine plural genitive"
            ),
            SanskritWordData(
                devanagari="गच्छामि",
                iast="gacchāmi",
                meaning="I go",
                part_of_speech="verb",
                difficulty=Difficulty.ADVANCED,
                root="गम् (gam)",
                additional_info="1st person singular present"
            ),
            SanskritWordData(
                devanagari="अगच्छत्",
                iast="agacchat",
                meaning="he/she went",
                part_of_speech="verb",
                difficulty=Difficulty.ADVANCED,
                root="गम् (gam)",
                additional_info="3rd person singular imperfect (past tense)"
            ),
            SanskritWordData(
                devanagari="धर्मशास्त्रम्",
                iast="dharmaśāstram",
                meaning="treatise on righteousness/duty",
                part_of_speech="noun (compound)",
                difficulty=Difficulty.ADVANCED,
                gender="neuter",
                case_info="nominative/accusative singular",
                additional_info="tatpuruṣa compound: dharma + śāstra"
            ),
            
            # Expert Level - Complex compounds and rare forms
            SanskritWordData(
                devanagari="राजपुत्रस्य",
                iast="rājaputrasya",
                meaning="of the prince",
                part_of_speech="noun (compound)",
                difficulty=Difficulty.EXPERT,
                gender="masculine",
                case_info="genitive singular",
                additional_info="tatpuruṣa compound: rāja + putra, genitive case"
            ),
            SanskritWordData(
                devanagari="सर्वभूतहिते",
                iast="sarvabhūtahite",
                meaning="in the welfare of all beings",
                part_of_speech="noun (compound)",
                difficulty=Difficulty.EXPERT,
                gender="neuter",
                case_info="locative singular",
                additional_info="complex tatpuruṣa: sarva + bhūta + hita"
            ),
            SanskritWordData(
                devanagari="चतुर्दशी",
                iast="caturdaśī",
                meaning="fourteenth (day of lunar month)",
                part_of_speech="adjective/noun",
                difficulty=Difficulty.EXPERT,
                gender="feminine",
                case_info="nominative singular",
                additional_info="ordinal number, ī-stem feminine"
            )
        ]
    
    def get_random_word(self, difficulty: Difficulty = None) -> SanskritWordData:
        """Get a random word, optionally filtered by difficulty"""
        if difficulty:
            filtered_words = [w for w in self.words if w.difficulty == difficulty]
            return random.choice(filtered_words) if filtered_words else random.choice(self.words)
        return random.choice(self.words)
    
    def get_words_by_difficulty(self, difficulty: Difficulty) -> List[SanskritWordData]:
        """Get all words of a specific difficulty level"""
        return [w for w in self.words if w.difficulty == difficulty]
    
    def search_words(self, query: str) -> List[SanskritWordData]:
        """Search for words containing the query string"""
        query = query.lower()
        results = []
        for word in self.words:
            if (query in word.devanagari.lower() or 
                query in word.iast.lower() or 
                query in word.meaning.lower()):
                results.append(word)
        return results
    
    def get_word_by_text(self, text: str) -> SanskritWordData:
        """Get word by Devanagari or IAST text"""
        for word in self.words:
            if word.devanagari == text or word.iast == text:
                return word
        return None
    
    def get_stats(self) -> Dict[str, int]:
        """Get database statistics"""
        stats = {
            "total_words": len(self.words),
            "beginner": len([w for w in self.words if w.difficulty == Difficulty.BEGINNER]),
            "intermediate": len([w for w in self.words if w.difficulty == Difficulty.INTERMEDIATE]),
            "advanced": len([w for w in self.words if w.difficulty == Difficulty.ADVANCED]),
            "expert": len([w for w in self.words if w.difficulty == Difficulty.EXPERT])
        }
        return stats


# Global database instance
_word_database = None

def get_word_database() -> WordDatabase:
    """Get the global word database instance"""
    global _word_database
    if _word_database is None:
        _word_database = WordDatabase()
    return _word_database