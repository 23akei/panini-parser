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
        self.kosha_begginer = list(filter(lambda d:  (d.dhatu.gana in [Gana.Bhvadi, Gana.Divadi, Gana.Tudadi, Gana.Curadi]) and d.dhatu.sanadi == [] and d.dhatu.prefixes==[] , self.kosha))
    
    def get_random_dhatu(self, level:str) -> Optional[Dhatu]:
        """ Get a random root word (dhatu) for gameplay """
        if level not in ["beginner", "expert"]:
            raise ValueError(f"Invalid level: {level}")
        if level == "beginner":
            # For beginner level, return a simple dhatu
            return random.choice(self.kosha_begginer).dhatu
        elif level == "expert":
            return random.choice(self.kosha).dhatu
        else:
            raise ValueError(f"Invalid level: {level}")
    def get_random_prakriya(self, dhatu, level: str) -> Optional[Prakriya]:
        # TODO: Implement logic to fetch a random dhatu or pratipadika
        return self.get_random_tinanta_prakriya(dhatu, level)

    def get_random_tinanta_prakriya(self, dhatu, level: str) -> Optional[Prakriya]:
        """ Get a random prakriya (word parsing) for gameplay """
        prayoga = self._get_random_prayoaga(level)
        lakara = self._get_random_lakara(level)
        purusha = self._get_random_purusha(level)
        vacana =  self._get_random_vacana(level)
        print(f"Generating prakriya for dhatu: {dhatu}, prayoga: {prayoga}, lakara: {lakara}, purusha: {purusha}, vacana: {vacana}")
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
    def _get_random_prayoaga(self, level: str) -> Prayoga:
        """ Get a random prayoga based on difficulty level """
        if level == "beginner":
            return Prayoga.Kartari
        elif level == "expert":
            return random.choice(Prayoga.choices())
        else:
            raise ValueError(f"Invalid level: {level}")
    def _get_random_lakara(self, level: str) -> Lakara:
        """ Get a random lakara based on difficulty level """
        if level == "beginner":
            return Lakara.Lat
        elif level == "expert":
            return random.choice(Lakara.choices())
        else:
            raise ValueError(f"Invalid level: {level}")
    def _get_random_purusha(self, level: str) -> Purusha:
        return random.choice(Purusha.choices())
    def _get_random_vacana(self, level: str) -> Vacana:
        """ Get a random vacana based on difficulty level """
        if level == "beginner":
            return random.choice([Vacana.Eka, Vacana.Bahu])
        elif level == "expert":
            return random.choice(Vacana.choices())
        else:
            raise ValueError(f"Invalid level: {level}")
    
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
