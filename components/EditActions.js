"use client"

import * as React from "react"
import { Edit2, Ellipsis, Trash2 } from "lucide-react"
import { useTranslation } from 'react-i18next'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function EditActions({onEdit, onDelete}) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onEdit()}
        >
           <Edit2 className="h-4 w-4" /> {t('domain.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 text-red-500" 
          onClick={() => onDelete()}
        >
          <Trash2 className="h-4 w-4" /> {t('domain.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
