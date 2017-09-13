USE `pokemon_db`;

SELECT t3.id, t3.username, t3.email, count(*) as numberOfSimilarPokemon
FROM userpokemon AS t1
INNER JOIN 
	(SELECT  pokemonNumber
	FROM userPokemon
	WHERE userId = 3) AS t2 ON t1.pokemonNumber = t2.pokemonNumber
INNER JOIN users AS t3 ON t1.userId = t3.id
WHERE t1.userId <> 3
GROUP BY userId
ORDER BY numberOfSimilarPokemon DESC