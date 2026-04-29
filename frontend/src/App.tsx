import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import LentlLanding from "./pages/LentlLanding.tsx";
import MilohaIndex from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import ManageInquiries from "./pages/admin/ManageInquiries.tsx";
import ManageSlider from "./pages/admin/ManageSlider.tsx";
import ManageProducts from "./pages/admin/ManageProducts.tsx";
import ManageTestimonials from "./pages/admin/ManageTestimonials.tsx";
import ManageFAQs from "./pages/admin/ManageFAQs.tsx";
import ManageContent from "./pages/admin/ManageContent.tsx";
import ManageUsers from "./pages/admin/ManageUsers.tsx";
import ManageRoles from "./pages/admin/ManageRoles.tsx";
import ManagePermissions from "./pages/admin/ManagePermissions.tsx";
import ManageAnalytics from "./pages/admin/ManageAnalytics.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* LeNTL Group corporate landing page (root) */}
                <Route path="/" element={<LentlLanding />} />

                {/* MILOHA Pure Grains operational page */}
                <Route path="/miloha" element={<MilohaIndex />} />

                {/* Admin login */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin portal — protected via AdminLayout */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="inquiries" element={<ManageInquiries />} />
                  <Route path="slider" element={<ManageSlider />} />
                  <Route path="products" element={<ManageProducts />} />
                  <Route path="testimonials" element={<ManageTestimonials />} />
                  <Route path="faqs" element={<ManageFAQs />} />
                  <Route path="content" element={<ManageContent />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="roles" element={<ManageRoles />} />
                  <Route path="permissions" element={<ManagePermissions />} />
                  <Route path="analytics" element={<ManageAnalytics />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
