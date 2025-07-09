import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto pb-16">
      <h1 className="text-3xl font-bold text-center mt-10 mb-1">Pokémon Explorer</h1>
      <p className="text-center text-gray-500 mb-15">Search and find Pokémon</p>

      <div className="grid grid-cols-3 items-center mb-3">
        <p className="text-xl font-medium">Explore Pokémon</p>
        <div className="col-span-2 flex justify-end">
          <Input placeholder="Find Pokémon" className="w-60" />
          <Button>Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-4">
        
        <Card className="p-0 mt-0">

            <div className="bg-gray-100">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`}
                  className="w-50 h-50"
                />
              </div>


          <div className="p-3 pt-2">
            <h2 className="text-small font-medium mb-1">Bulbasoar</h2>
            <p className="text-xs text-gray-500 mb-2">#0001</p>

            
            <div className="text-left mt-3">
                <Badge className="bg-gray-800 text-white">Grass</Badge>
              </div>
          </div>
        </Card>
      </div>

      <nav className="flex justify-center gap-2 mt-12">
        <Button disabled className="opacity-40 cursor-not-allowed">&lt;</Button>
        <Button>&gt;</Button>
      </nav>
    </main>
  )
}