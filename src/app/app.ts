import { Component, computed, signal } from '@angular/core';

export interface Contacto {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  grupo: string;
  favorito: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  contactos = signal<Contacto[]>([]);
  busqueda = signal('');

  constructor() {
    this.cargar();
  }

  async cargar() {
    const res = await fetch('/contactos.json');
    const datos: Contacto[] = await res.json();
    this.contactos.set(datos);
  }

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase() ?? '')
      .join('');
  }

  cambiarFavorito(id: number) {
    this.contactos.update(lista =>
      lista.map(c => c.id === id ? { ...c, favorito: !c.favorito } : c)
    );
  }

  cambiarGrupo(id: number, nuevoGrupo: string) {
    this.contactos.update(lista =>
      lista.map(c => c.id === id ? { ...c, grupo: nuevoGrupo } : c)
    );
  }

  colorGrupo(grupo: string): string {
    if (grupo === 'Clase') return 'text-bg-primary';
    if (grupo === 'Familia') return 'text-bg-warning';
    return 'text-bg-secondary';
  }

  numFavoritos = computed(() =>
    this.contactos().filter(c => c.favorito).length
  );

  filtrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    return this.contactos()
      .filter(c => c.nombre.toLowerCase().includes(texto))
      .sort((a, b) => Number(b.favorito) - Number(a.favorito));
  });
}