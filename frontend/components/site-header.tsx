import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { StatusBadge } from "@/components/status-badge"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
    return (
        <header className="bg-background rounded-t-lg sticky top-0 z-50 flex w-full items-center border-b">
            <div className="flex h-14 w-full items-center gap-2 px-4 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb className="hidden sm:flex">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground text-sm">OpenOA Cloud</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                                AEP Analysis
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto flex items-center gap-2">
                    <StatusBadge />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
