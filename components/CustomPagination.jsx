import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from 'react-i18next'

export function CustomPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 flex justify-center items-center gap-5">
      <div>
        <Pagination>
          <PaginationContent className="gap-6" >
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label={t('domain.pagination.previous')}
                className="cursor-pointer w-auto px-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('domain.pagination.previous')}
              </PaginationLink>
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => onPageChange(i + 1)}
                  isActive={currentPage === i + 1}
                  aria-label={t('domain.pagination.page', { page: i + 1 })}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label={t('domain.pagination.next')}
                className="cursor-pointer w-auto px-2"
              >
                {t('domain.pagination.next')}
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="text-base text-foreground">
        {t('domain.pagination.of', { total: totalPages })}
      </div>
    </div>
  )
} 