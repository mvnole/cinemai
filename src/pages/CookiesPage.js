import React from "react";
import {
  Lock,
  BarChart2,
  Megaphone,
  Settings2,
  Info,
  Mail
} from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 text-zinc-100">
      <div className="flex items-center gap-3 mb-8">
        <Settings2 className="w-9 h-9 text-cyan-400" />
        <h1 className="text-4xl font-bold text-cyan-400">Politica de Cookies</h1>
      </div>
      <p className="mb-6 text-lg text-zinc-200/90">
        <b>Ultima actualizare:</b> Iulie 2025
      </p>
      <p className="mb-6">
        CinemAI folosește cookies și tehnologii similare pentru a-ți oferi o experiență sigură, fluidă și personalizată. Alegi ce cookies accepți, direct din bannerul afișat sau chiar de aici:
        <button
          className="ml-2 underline text-cyan-400 hover:text-cyan-300 font-semibold"
          type="button"
          onClick={() => window.dispatchEvent(new Event("cookie-preference-change"))}
        >
          Modifică preferințele de cookies
        </button>
        .
      </p>

      <div className="mt-8 grid gap-8">
        <section className="flex gap-3 items-start">
          <Info className="min-w-8 w-8 h-8 text-cyan-400 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-1 text-cyan-300">1. Ce sunt cookies?</h2>
            <p className="text-zinc-200/90">
              Cookies sunt fișiere text mici salvate pe dispozitivul tău la accesarea platformei, ajutând la memorarea preferințelor, securitate și optimizare.
            </p>
          </div>
        </section>

        <section className="flex gap-3 items-start">
          <Settings2 className="min-w-8 w-8 h-8 text-cyan-400 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-1 text-cyan-300">2. Tipuri de cookies folosite</h2>
            <div className="space-y-3 mt-1">
              <div className="flex items-center gap-2">
                <Lock className="w-6 h-6 text-cyan-400" />
                <b>Strict necesari</b>
                <span className="ml-1 text-zinc-400 text-sm">(nu pot fi dezactivați)</span>
              </div>
              <p className="ml-8 text-zinc-200/80">
                Esențiali pentru funcționarea CinemAI (ex: autentificare, securitate, salvarea preferințelor).
              </p>
              <div className="flex items-center gap-2 mt-2">
                <BarChart2 className="w-6 h-6 text-cyan-400" />
                <b>Analytics</b>
              </div>
              <p className="ml-8 text-zinc-200/80">
                Ne ajută să înțelegem ce pagini vizitezi, ce funcții folosești și cum putem îmbunătăți experiența (ex: Google Analytics).
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Megaphone className="w-6 h-6 text-cyan-400" />
                <b>Marketing</b>
              </div>
              <p className="ml-8 text-zinc-200/80">
                Pentru reclame personalizate sau retargeting (ex: Facebook Pixel).
              </p>
            </div>
          </div>
        </section>

        <section className="flex gap-3 items-start">
          <Settings2 className="min-w-8 w-8 h-8 text-cyan-400 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-1 text-cyan-300">3. Cum poți gestiona cookies?</h2>
            <ul className="list-disc pl-8 space-y-2 mt-2 text-zinc-200/80">
              <li>
                <b>Direct pe CinemAI:</b> Poți modifica preferințele de consimțământ oricând folosind acest <button className="underline text-cyan-400" type="button" onClick={() => window.dispatchEvent(new Event("cookie-preference-change"))}>link</button> sau bannerul de jos.
              </li>
              <li>
                <b>Din browser:</b> Poți bloca sau șterge cookies din setările browserului, dar anumite funcții esențiale pot deveni indisponibile.
              </li>
            </ul>
          </div>
        </section>

        <section className="flex gap-3 items-start">
          <Settings2 className="min-w-8 w-8 h-8 text-cyan-400 mt-1" />
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-1 text-cyan-300">4. Exemple de cookies folosite</h2>
            <div className="rounded-xl overflow-hidden border border-zinc-700 shadow">
              <table className="w-full text-sm bg-zinc-900">
                <thead>
                  <tr className="bg-zinc-800 text-cyan-400">
                    <th className="p-2 text-left">Nume</th>
                    <th className="p-2 text-left">Categorie</th>
                    <th className="p-2 text-left">Scop</th>
                    <th className="p-2 text-left">Durată</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-700">
                    <td className="p-2">cinemai_cookie_preferences</td>
                    <td className="p-2">Strict necesari</td>
                    <td className="p-2">Salvează preferințele de consimțământ ale utilizatorului</td>
                    <td className="p-2">12 luni</td>
                  </tr>
                  <tr className="border-t border-zinc-700">
                    <td className="p-2">_ga, _gid</td>
                    <td className="p-2">Analytics</td>
                    <td className="p-2">Statistici Google Analytics (dacă e activ)</td>
                    <td className="p-2">2 ani / 24 ore</td>
                  </tr>
                  <tr className="border-t border-zinc-700">
                    <td className="p-2">fr, _fbp</td>
                    <td className="p-2">Marketing</td>
                    <td className="p-2">Facebook Pixel (reclame, retargeting)</td>
                    <td className="p-2">3 luni</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="flex gap-3 items-start">
          <Settings2 className="min-w-8 w-8 h-8 text-cyan-400 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-1 text-cyan-300">5. Modificarea consimțământului</h2>
            <p className="text-zinc-200/90">
              Îți poți schimba oricând preferințele de cookies folosind linkul sau bannerul de pe site. Setările tale vor fi respectate la fiecare vizită.
            </p>
          </div>
        </section>

        <section className="flex gap-3 items-start">
          <Mail className="min-w-8 w-8 h-8 text-cyan-400 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-1 text-cyan-300">6. Contact</h2>
            <p className="text-zinc-200/90">
              Pentru orice întrebări privind cookies sau date personale, scrie-ne la <a href="mailto:support@cinemai.live" className="underline text-cyan-400">support@cinemai.live</a>.
            </p>
            <p className="mt-3 text-xs text-zinc-400">
              Pentru detalii despre datele personale, vezi și <a href="/privacy" className="underline text-cyan-400">Politica de confidențialitate</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
