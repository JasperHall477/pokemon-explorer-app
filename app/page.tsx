'use client'
import { useEffect, useState } from "react"

// Import required shadcn components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mapping attributes we'll store per pokemon
type Pokemon = {
  name: string
  url: string
}

export default function HomePage() {
  
  // Store pokemon data
  const [pokemonList, updatePokemonList] = useState<Pokemon[]>([])
  // Stores loading state to check if we display loading symbol or not
  const [loading, setLoading] = useState(false)
  // Stores current position for pagination/what pokemon to get data on
  const [position, updatePosition] = useState(0)

  // Error incase api fails
  const [error, setError] = useState(false)


  // Async function to get info on relevant number of pokemon from the pokeAPI
  const getPokemonInfo = async (currentPos: number) => {
    setLoading(true)
    try {
      // Call the api for pokemon from current position + 12 (1 page worth)
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${currentPos}&limit=12`)
      const data = await res.json()
      // Update the list with json data
      updatePokemonList(data.results)
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



  return (
    <main className="max-w-4xl mx-auto pb-16">

      {/* Header section */}
      <h1 className="text-3xl font-bold text-center mt-10 mb-1">Pokémon Explorer</h1>
      <p className="text-center text-gray-500 mb-18">Search and find Pokémon</p>

      <div className="grid grid-cols-3 items-center mb-3">
        <p className="text-xl font-medium">Explore Pokémon</p>
        <div className="col-span-2 flex justify-end">
          <Input placeholder="Find Pokémon" className="w-60" />
          <Button>Search</Button>
        </div>
      </div>

      {/* The error message we show if api call fails */}
      {error && (
          <div className="pt-10 pb-10 text-red-700 p-3 mb-4 text-center">
            Can't access PokeAPI. Please try again later.
          </div>
        )}  

      {/*  Grid of pokemon results changes style on screen size */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
       {loading ? (
          <p>Loading...</p>
        ) : (
          pokemonList.map((pokemon, index) => {
            const id = position + index + 1
            return (
              <Card key={pokemon.name} className="p-0 gap-2">
                
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={pokemon.name}
                    className="w-40 h-40"
                  />
                </div>
              
              <div className="p-3 pt-2">
                <h2 className="text-small font-medium mb-1">{pokemon.name}</h2>
                <p className="text-xs text-gray-500 mb-2">#{String(id).padStart(4, "0")}</p>

                
                <div className="text-left mt-3">
                  <Badge className="bg-gray-800 text-white">Grass</Badge>
                </div>
              </div>

              </Card>
            )
          })
        )}
      </div>

        {/* Navigation buttons  */}
      <div className="flex justify-center gap-4 mt-8">
      <Button
        onClick={() => updatePosition(prev => Math.max(prev - 12, 0))}
        className={position === 0 ? "opacity-50 cursor-not-allowed" : ""}
        disabled={position === 0}>
        &lt; Back
      </Button>
      <Button
        onClick={() => updatePosition(prev => prev + 12)}>
        Next &gt;
      </Button>
    </div>
    </main>
  )
}