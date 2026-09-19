import {NextResponse} from 'next/server';
import {db} from '@/db';
import {categories} from '@/db/schema';
import {asc} from 'drizzle-orm';
export async function GET(){try{return NextResponse.json({categories:await db.select().from(categories).orderBy(asc(categories.sortOrder),asc(categories.name))})}catch(e){console.error(e);return NextResponse.json({categories:[]},{status:500})}}
