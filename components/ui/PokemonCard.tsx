
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


type Pokemon = {
  name: string
  id: number
  types: string[]
}

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {


 

  const badgeColours: { [key: string]: string } = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  }



  return (
 
  <Card className="group p-0 gap-2 cursor-pointer transition hover:shadow-lg hover:bg-gray-200">
    <div className="w-full items-center justify-center flex bg-gray-100 group-hover:bg-gray-200 transition">
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        className="w-40 h-40"
        style={
          { 
            imageRendering: "pixelated" 
          }
        }
      />
    </div>

    <div className="p-3 pt-2">
      <h2 className="text-small font-medium capitalize mb-1">{pokemon.name}</h2>
      <p className="text-xs text-gray-500 mb-2">#{String(pokemon.id).padStart(4, "0")}</p>

      <div className="text-left mt-3">
          {pokemon.types.map((typeName) => (
                <Badge key={typeName}
                  style={{
                    backgroundColor: badgeColours[typeName] || "#666",
                    color: "#fff",
                    border: '1px solid gray',
                    textTransform: "capitalize",
                    marginRight: "4px"}}>
                  {typeName}</Badge>
          ))}
      </div>
    </div>
  </Card>

  

  )
}