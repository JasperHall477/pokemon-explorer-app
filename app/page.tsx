'use client'
import { useEffect, useState } from "react"

// Import required shadcn components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


import { useDebounce } from "@/lib/debounce"

// Mapping attributes we'll store per pokemon
type Pokemon = {
  name: string
  url: string
  id: number
  types: string[]
}

type BasicPokemon = {
  name: string
  url: string
}

export default function HomePage() {
  
  // Store pokemon data
  const [pokemonList, updatePokemonList] = useState<Pokemon[]>([])

  const [allPokemon, updateAllPokemon] = useState<BasicPokemon[]>([])

  // Stores loading state to check if we display loading symbol or not
  const [loading, setLoading] = useState(false)
  // Stores current position for pagination/what pokemon to get data on
  const [position, updatePosition] = useState(0)
  // Seperate position for during search process
  const [searchPosition, updateSearchPosition] = useState(0)
  const [matches, setMatches] = useState<BasicPokemon[]>([])

  const [filteredList, setFilteredList] = useState<Pokemon[]>([])
  const [search, setSearch] = useState("")
  // Error incase api fails
  const [error, setError] = useState(false)
  const debouncedSearch = useDebounce(search, 300)


  useEffect(() => {
    const getAllNames = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000`)
      const data = await res.json()
      updateAllPokemon(data.results)
    }
    getAllNames()
  }, [])


  // Async function to get info on relevant number of pokemon from the pokeAPI
  const getPokemonInfo = async (currentPos: number) => {
    setLoading(true)
    try {
      // Call the api for pokemon from current position + 12 (1 page worth)
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${currentPos}&limit=12`)
      const json = await response.json()
      const results = json.results

      // Store the full results from second api call
      const fullPokemonData: Pokemon[] = []

      // Loop through each pokemon and get its full details
      for (let i = 0; i < results.length; i++) {
        const pokemon = results[i]
        const detailResponse = await fetch(pokemon.url)
        const data = await detailResponse.json()

        // Array for pokemon types
        const typesArray = []
        for (let i = 0; i < data.types.length; i++) {
          typesArray.push(data.types[i].type.name)
        }

        fullPokemonData.push({
          name: pokemon.name,
          url: pokemon.url,
          id: data.id,
          types: typesArray
        })
      }

      // Update the list with full data data
      updatePokemonList(fullPokemonData)
      setFilteredList(fullPokemonData)
    } catch (e) {
      // If the api call fails flag this error to display a message
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // Calls getPokemonInfo on initial load and whenever position changes (page change)
  useEffect(() => {
    getPokemonInfo(position)
  }, [position])

  


  useEffect(() => {

  if (!debouncedSearch.trim()) {
    setFilteredList(pokemonList)
    setMatches([])
    return
  }

  // Filter only once, store all matches
  const matches = allPokemon.filter(p =>
    p.name.toLowerCase().startsWith(debouncedSearch.toLowerCase())
  )
  setMatches(matches)
  updateSearchPosition(0)
}, [debouncedSearch, allPokemon])


useEffect(() => {
  const fetchSearchResults = async () => {
    if (matches.length === 0) return
    setLoading(true)

    const sliced = matches.slice(searchPosition, searchPosition + 12)
    const detailed: Pokemon[] = []

    for (let i = 0; i < sliced.length; i++) {
      const res = await fetch(sliced[i].url)
      const data = await res.json()

      const typesArray: string[] = []
      for (let i = 0; i < data.types.length; i++) {
        typesArray.push(data.types[i].type.name)
      }

      detailed.push({
        name: data.name,
        url: sliced[i].url,
        id: data.id,
        types: typesArray,
      })
    }

    setFilteredList(detailed)
    setLoading(false)
  }

  fetchSearchResults()
}, [searchPosition, matches])

  return (
    <main className="max-w-4xl mx-auto pb-16"
    style={{ zoom: 0.5}}>

        <h1 className="text-3xl font-bold text-center mt-10 mb-1">Pokémon Explorer</h1>
      <p className="text-center text-gray-500 mb-18">Search and find Pokémon</p>

      <div className="grid grid-cols-3 items-center mb-3">
        
        <p className="text-xl font-medium">
          {search.trim()
            ? `Search results for "${search}"`
            : "Explore Pokémon"}
        </p>

        <div className="col-span-2 flex justify-end">
          {/* <Input placeholder="Find Pokémon" className="w-60" /> */}
          <Input
            placeholder="Find Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-68"
          />
          <Button>Search</Button>
        </div>
      </div>

      {error && (
          <div className="pt-10 pb-10 text-red-700 p-3 mb-4 text-center">
            Can't access PokeAPI. Please try again later.
          </div>
        )}  

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
       {loading ? (

        <div className="w-15 h-15 border-2 m-100 border-black border-t-white rounded-full animate-spin" />  
        
      ) : (
        
          // (search.trim() ? filteredList.slice(searchPosition, searchPosition + 12) : filteredList).map((pokemon, index) => {
          (search.trim() ? filteredList : pokemonList).map((pokemon) => {
          
            // const id = position + index + 1
            const id = pokemon.id
            return (

              
              <Card key={pokemon.name} className="p-0 gap-2">
                
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    className="w-40 h-40"
                    style={
                      {
                        imageRendering: "pixelated"
                      }
                    }
                  />
                </div>
              
              <div className="p-3 pt-2">
                {/* <h2 className="text-small font-medium mb-1">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2> */}
                <h2 className="text-small font-medium capitalize mb-1">{pokemon.name}</h2>
                <p className="text-xs text-gray-500 mb-2">#{String(id).padStart(4, "0")}</p>

                
                <div className="text-left mt-3">
                  {/* <Badge className="bg-gray-800 text-white">Grass</Badge> */}
                  {pokemon.types.map((typeName) => (
                    <Badge key={typeName} className="bg-gray-800 text-white capitalize mr-1">{typeName}</Badge>
                  ))}
                </div>
              </div>

              </Card>
            )
          })
        )}
      </div>

        {/* Nav buttons  */}
      <div className="flex justify-center gap-4 mt-8">
      {search.trim() ? (
    <>
      <Button
        onClick={() => updateSearchPosition(prev => Math.max(prev - 12, 0))}
        disabled={searchPosition === 0}
        className={searchPosition === 0 ? "opacity-50 cursor-not-allowed" : ""}
      >&lt; Back</Button>
      <Button
        onClick={() => updateSearchPosition(prev => prev + 12)}
        disabled={searchPosition + 12 >= matches.length}
        className={(searchPosition + 12 >= matches.length) ? "opacity-50 cursor-not-allowed" : ""}
      >Next &gt;</Button>
    </>
  ) : (
    <>
      <Button
        onClick={() => updatePosition(prev => Math.max(prev - 12, 0))}
        disabled={position === 0}
        className={position === 0 ? "opacity-50 cursor-not-allowed" : ""}
      >&lt; Back</Button>
      <Button
        onClick={() => updatePosition(prev => prev + 12)}
      >Next &gt;</Button>
    </>
  )}
</div>

  <p className="font-semibold text-center mt-4">Thank you for using Pokemon Browser!</p>
    </main>
  )
}