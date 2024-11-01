'use server'

import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function saveDomain(data) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('未授权')
  }

  if (data.id) {
    return await prisma.domain.update({
      where: { id: data.id },
      data: {
        name: data.name,
        url: data.url,
        userId: session.user.id
      }
    })
  } else {
    return await prisma.domain.create({
      data: {
        name: data.name,
        url: data.url,
        userId: session.user.id
      }
    })
  }
}

export async function deleteDomain(id) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('未授权')
  }

  return await prisma.domain.delete({
    where: { id: id, userId: session.user.id }
  })
}

export async function pageDomains(page, pageSize) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('未授权')
  }

  const total = await prisma.domain.count({ where: { userId: session.user.id } })
  const data = await prisma.domain.findMany({
    where: { userId: session.user.id },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  return { total, data: JSON.parse(JSON.stringify(data)) }
}

export async function getDomain(id) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('未授权')
  }

  const domain = await prisma.domain.findUnique({
    where: { id: id, userId: session.user.id }
  })

  return JSON.parse(JSON.stringify(domain))
}
