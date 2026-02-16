import Link from "next/link"
import { Home } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { StatusBadge } from "@/components/status-badge"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    return (
        <header className="bg-background rounded-t-lg sticky top-0 z-50 flex w-full items-center border-b backdrop-blur supports-[backdrop-filter]:bg-background/95">
            <div className="flex h-14 w-full items-center gap-2 px-4 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb className="hidden sm:flex">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                                    OpenOA Cloud
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                                AEP Analysis
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    asChild 
                    className="sm:hidden"
                >
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </Button>
                <div className="ml-auto flex items-center gap-2">
                    <StatusBadge />
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
