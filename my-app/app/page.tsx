import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <div className="p-8">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>sample</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="enter here" />
          <Button>submit</Button>
        </CardContent>
      </Card>
    </div>
  )
}