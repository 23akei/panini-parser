"""
Service layer for word-related business logic
"""

from typing import  Optional
import random

from vidyut.prakriya import Vyakarana,Dhatu,Pada, Lakara, Prayoga, Purusha, Vacana, Prakriya, Linga, Vibhakti , Gana
from vidyut.kosha import Kosha, DhatuEntry

class WordService:
    """Service for word-related operations"""
    def __init__(self, kosha:Kosha ):
        self._v = Vyakarana()
        self.kosha:list[DhatuEntry] = list(kosha.dhatus())
    
    def get_random_dhatu(self) -> Optional[Dhatu]:
        """ Get a random root word (dhatu) for gameplay """
        return random.choice(self.kosha).dhatu
    def get_random_prakriya(self, dhatu) -> Optional[Prakriya]:
        # TODO: Implement logic to fetch a random dhatu or pratipadika
        return self.get_random_tinanta_prakriya(dhatu)

    def get_random_tinanta_prakriya(self, dhatu) -> Optional[Prakriya]:
        """ Get a random prakriya (word parsing) for gameplay """
        prayoga = random.choice(Prayoga.choices())
        lakara = random.choice(Lakara.choices())
        purusha = random.choice(Purusha.choices())
        vacana = random.choice(Vacana.choices())
        prakriyas = self._v.derive(Pada.Tinanta(
            dhatu=dhatu,
            prayoga=prayoga,
            lakara=lakara,
            purusha=purusha,
            vacana=vacana
        ))
        if len(prakriyas) == 0:
            return None
        if len(prakriyas) > 1:
            return random.choice(prakriyas)
        return prakriyas[0]
    def get_random_subanta_prakriya(self, pratipadika) -> Optional[Prakriya]:
        linga = random.choice(Linga.choices())
        vibhakti = random.choice(Vibhakti.choices())
        vacana = random.choice(Vacana.choices())
        prakriyas =  self._v.derive(Pada.Subanta(
            pratipadika=pratipadika,
            linga=linga,
            vibhakti=vibhakti,
            vacana=vacana
        ))
        if len(prakriyas) == 0:
            return None
        if len(prakriyas) > 1:
            return random.choice(prakriyas)
        return prakriyas[0]
