import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import Footer from "@/components/ui/Footer";


export default async function HomePage({ params }: { params: { pokemon: string } }) {

    // Colour map for badges
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

    // All types for working out weaknesses
    const allTypes = [
        "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
        "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon",
        "dark", "steel", "fairy"
    ]

    // Main details of pokemon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.pokemon}`)
    const details = await response.json()

    // Get all types of this pokemon
    const typesArray = []
    for (let i = 0; i < details.types.length; i++) {
        typesArray.push(details.types[i].type.name)
    }
    
    // Seperate call to different endpoint for species detaisl
    const species = await fetch(details.species.url)
    const speciesDetails = await species.json()

    // Get english description remove and strange symbol that appears in them all
    const description = speciesDetails.flavor_text_entries.find((entry: any) => entry.language.name === "en").flavor_text.replace(/\f/g, " ")
    const category = speciesDetails.genera.find((genus: any) => genus.language.name === "en")?.genus

    // Calculate allowed genders 
    function getGenders(rate: number): string {
        if (rate === -1) {
            return "Genderless"
        }
        else if (rate === 0){
            return "Male only"
        }
        else if (rate === 8){
            return "Female only"
        } 
        else{
            return "Male / Female"
        }
        
    }
    const gender = getGenders(speciesDetails.gender_rate)


    const stats = []
    for(let i = 0; i < details.stats.length; i++) {
        stats.push({
            name: details.stats[i].stat.name,
            value: details.stats[i].base_stat,
        })
    }


    const abilities = []
    for (let i = 0; i < details.abilities.length; i++){
        abilities.push(details.abilities[i].ability.name)
    }
   
    // Seperate endpoint to get abilities details
    const abilityurl = await fetch(details.abilities[0].ability.url)
    const abilityDetails = await abilityurl.json()

    // Seperate array to hold each ability and its description(effect) together
    const abilityEffect = []
    for (let i = 0; i < details.abilities.length; i++) {
        const abilityName = details.abilities[i].ability.name
        const abilityUrl = details.abilities[i].ability.url

        const abilityResponse = await fetch(abilityUrl)
        const abilityData = await abilityResponse.json()

        const effect = abilityData.effect_entries.find(
            (entry: any) => entry.language.name === "en"
        )?.short_effect || "No description available."

        abilityEffect.push({ name: abilityName, effect })
    }



    const typeUrls = details.types.map((t: any) => t.type.url)

    // Calculate weaknesses depending on pokemon types
    const typeEffectMap: { [type: string]: number } = {}

    // Set all to 1 as default
    for (const attackType of allTypes) {
        typeEffectMap[attackType] = 1 
    }

    for (const url of typeUrls) {
        const responseType = await fetch(url)
        const typeData = await responseType.json()

        // Corresponding damage relation to a calculation
        typeData.damage_relations.double_damage_from.forEach((t: any) => {
            typeEffectMap[t.name] *= 2
        })

        typeData.damage_relations.half_damage_from.forEach((t: any) => {
            typeEffectMap[t.name] *= 0.5
        })

        typeData.damage_relations.no_damage_from.forEach((t: any) => {
            typeEffectMap[t.name] *= 0
        })
    }
    // Anything more than 1 is a weakness
    const weaknesses = Object.entries(typeEffectMap).filter(([type, multiplier]) => multiplier > 1).map(([type]) => type)


  

  return (
    <>
    <main className="select-none" style={{ zoom: 0.8}}>

        
        
        <p className="font-semibold text-xs pt-1 p-4 pb-2">Pokémon Browser</p>
        <div className="bg-[#d1d1d1] h-16 flex items-center justify-center"></div>
            <div className="flex items-center justify-center pb-10">
                
                <div className="w-24 h-24 bg-[#f4f4f5] rounded-full -mt-4">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png`}
                    className="w-24 h-24"
                    style={
                      {
                        imageRendering: "pixelated"
                      }
                    }
                  />
                <div className='flex items-baseline justify-center'>
                    <h2 className="text-small pr-2 font-medium capitalize">{details.name}</h2>
                    <p className="text-xs font-medium text-gray-500">#{String(details.id).padStart(4, "0")}</p>
                </div>

              
            </div>
   
        </div>
                    
                    
        <div className="max-w-4xl mx-auto px-4">   
        
         
            <div className="bg-[#f5f4f4] border shadow-lg rounded-l p-4 flex items-center zitems-start mr-10 ml-10 mt-3">
                    
                    
                <div className="flex-shrink-0 flex items-center w-12 h-12 bg-white border justify-center rounded-full">
                    <img
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cherish-ball.png"
                        alt="Poké Ball"
                        className="w-12 h-12"
                        style={
                        {
                            imageRendering: "pixelated"
                        }
                        }
                        />
                        </div>
                    <p className="ml-4 text-sm text-gray-800">
                        {description}
                    </p>
                </div>
            

         
            
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-10 zw-8/10">
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm md:row-span-2">
                        <p className="font-semibold mb-2">Height</p>
                        <p>{details.height/10}m</p>
                        <p className="font-semibold mt-4 mb-2">Category</p>
                        <p>{category}</p>
                        <p className="font-semibold mt-4 mb-2">Weight</p>
                        <p>{details.weight/10}kg</p>
                        <p className="font-semibold mt-4 mb-2">Gender</p>
                        <p>{gender}</p>
                    </div>

                
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                        <p className="font-semibold">Type</p>
                        <div className="flex gap-2 mt-1 mb-2">
                            {typesArray.map((typeName) => (
                            <Badge
                            key={typeName}
                            style={{
                                backgroundColor: badgeColours[typeName] || "#666",
                                color: "#fff",
                                border: "1px solid gray",
                                textTransform: "capitalize",
                                marginRight: "4px",
                            }}
                            >{typeName}</Badge>
                        ))}
                        </div>
                        <p className="font-semibold">Weaknesses</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {weaknesses.map((type) => (
                            <Badge
                            key={type}
                            style={{
                                backgroundColor: badgeColours[type] || "#666",
                                color: "#fff",
                                border: "1px solid gray",
                                textTransform: "capitalize",
                            }}
                            >
                            {type}
                            </Badge>
                        ))}
                        </div>
                    </div>

                
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                        <p className="font-semibold">Abilities</p>
                        <div className="capitalize text-xs">
                            {abilityEffect.map((ability) => (
                                <div key={ability.name}>
                                <p className="capitalize font-semibold">{ability.name}</p>
                                <p className="text-gray-600 text-xs italic">{ability.effect}</p>
                                </div>
                            ))}
                        </div>
                        
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm md:col-span-2">
                        <div className="space-y-2 text-sm">
                            {stats.map(stat => (
                                <div key={stat.name} className="flex items-center gap-3">

                                <span className="capitalize w-32">
                                    {stat.name.replace('-', ' ')}
                                </span>

                                <div className="flex-1 bg-gray-200 h-3 rounded-full">
                                    <div className="bg-black h-3 rounded-full" style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}/>
                                </div>

                                <p>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
            
                </div>




            <div className="mt-4 ml-10">
                <Link href="/">
                    <Button variant="default" className="text-xs">← Return Home</Button>
                </Link>
                
            </div>

        </div>


    </main>

     <Footer />  
    </>
  )
}
