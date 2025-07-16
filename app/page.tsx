'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'

// Import required shadcn components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Custom components
import PokemonCard from "@/components/ui/PokemonCard"
import Footer from "@/components/ui/Footer";

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

  const router = useRouter()
  
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

  // Gets pokemon info initial and when page position changes
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
      if (matches.length === 0) {
        return
      }

      setLoading(true)

      // Extract 12 pokemon matches for current page
      const sliced = matches.slice(searchPosition, searchPosition + 12)
      const detailed: Pokemon[] = []

      // Loop through each pokemon in current slice 
      for (let i = 0; i < sliced.length; i++) {
        // Get more detailed info on each pokemon
        const res = await fetch(sliced[i].url)
        const data = await res.json()

        // Create/fill array with types
        const typesArray: string[] = []
        for (let i = 0; i < data.types.length; i++) {
          typesArray.push(data.types[i].type.name)
        }

        // Add full details to final array
        detailed.push({
          name: data.name,
          url: sliced[i].url,
          id: data.id,
          types: typesArray,
        })
      }

      // FInished looping add full details array to current filtered list
      setFilteredList(detailed)
      setLoading(false)
    }

    fetchSearchResults();
  }, [searchPosition, matches])

  return (
    <>
    <h1 className="text-3xl font-bold text-center pt-2">Pokémon Browser</h1>
    <p className="text-center text-gray-500 mb-4">Search and find Pokémon</p>
    <hr className="w-full border-gray-200 mt-8 mb-4" />

      <main className="max-w-4xl mx-auto pb-16 select-none" style={{ zoom: 0.6}}>


        <div className="grid grid-cols-3 items-center mb-3">
          
          <p className="text-xl font-semibold">
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
            {/* <Button>Search</Button> */}
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
            
              return (

             
              <Link href={`/details/${pokemon.name}`} key={pokemon.name}>
                <div onClick={() => setLoading(true)} className="relative cursor-pointer">
                  <PokemonCard key={pokemon.name} pokemon={pokemon} />
                </div>
              </Link>
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
        
    </main>

    <Footer /> 
    </>
  )
}