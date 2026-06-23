import { NextResponse }
from "next/server";

export async function POST(){

 return NextResponse.json({

 answer:`

Students at Risk:
12

Teachers Needing Support:
4

Fee Collection Gap:
₹2.4L

Recommended Focus:

1. Academic Intervention
2. Fee Recovery
3. Teacher Coaching

`

 });

}
