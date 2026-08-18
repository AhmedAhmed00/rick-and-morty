import Image from "next/image";
import { Container } from "./container";
import logo from "@/public/LogoA.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="flex items-center justify-between gap-4 py-6">
        <Image src={logo} alt="Rick and Morty" height={24} />
        <p className="text-xs text-muted-fg">
          © {new Date().getFullYear()} Ahmed Ahmed
        </p>
      </Container>
    </footer>
  );
}
