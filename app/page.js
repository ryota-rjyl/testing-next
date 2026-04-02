"use client"; // ← Perintah Next.js agar komponen ini berjalan di sisi browser (client-side)
              //   Karena kita pakai interaksi user (klik, ketik), ini wajib ada

// ============================================================
// IMPORT
// ============================================================

// useState adalah React Hook untuk menyimpan "state" (data yang bisa berubah)
// Mirip seperti "variabel hidup" — kalau nilainya berubah, tampilan otomatis update
import { useState } from "react";

// ============================================================
// KOMPONEN UTAMA
// ============================================================

export default function HomePage() {

  // ----------------------------------------------------------
  // STATE — "Memori" komponen ini
  // ----------------------------------------------------------

  // useState("") → membuat state bernama 'input' dengan nilai awal string kosong
  // 'input'    → nilai saat ini (apa yang user ketik)
  // 'setInput' → fungsi untuk mengubah nilai 'input'
  const [input, setInput] = useState("");

  // useState([]) → membuat state bernama 'todos' dengan nilai awal array kosong
  // 'todos'    → daftar semua todo item
  // 'setTodos' → fungsi untuk mengubah daftar todo
  const [todos, setTodos] = useState([]);

  // ----------------------------------------------------------
  // FUNGSI — Logika yang terjadi saat user berinteraksi
  // ----------------------------------------------------------

  // Fungsi ini dipanggil saat user klik tombol "Tambah"
  const handleTambah = () => {

    // .trim() → Method String: menghapus spasi di awal & akhir teks
    // Contoh: "  beli susu  ".trim() → "beli susu"
    // Kita cek dulu apakah input tidak kosong setelah di-trim
    if (input.trim() === "") return; // Kalau kosong, berhenti, tidak tambah apa-apa

    // Membuat objek todo baru
    const todoBaru = {
      id: Date.now(), // Date.now() → Method Date: menghasilkan angka unik berdasarkan waktu sekarang
                      // Contoh: 1712050000000 — dipakai sebagai ID unik tiap todo
      teks: input.trim(), // Simpan teks yang sudah dibersihkan spasinya
      selesai: false,     // Awalnya belum selesai
    };

    // setTodos memanggil updater function dengan spread operator (...)
    // [...todos, todoBaru] → Method Array (Spread): menyalin semua isi 'todos' yang lama,
    //                        lalu menambahkan 'todoBaru' di bagian akhir
    // React tidak boleh langsung push ke array lama — harus buat array BARU
    setTodos([...todos, todoBaru]);

    // Setelah ditambahkan, kosongkan input kembali
    setInput("");
  };

  // Fungsi ini dipanggil saat user klik todo item (toggle selesai/belum)
  const handleToggle = (id) => {

    // .map() → Method Array: membuat array BARU dengan transformasi tiap elemen
    // Mirip "untuk setiap item, lakukan sesuatu, lalu kumpulkan hasilnya"
    const todosBaru = todos.map((todo) => {

      // Cek apakah ini todo yang diklik (berdasarkan id)
      if (todo.id === id) {
        // Buat objek baru dengan spread operator, tapi balik nilai 'selesai'
        // {...todo} → salin semua properti todo yang lama
        // selesai: !todo.selesai → balik nilai boolean (true→false, false→true)
        return { ...todo, selesai: !todo.selesai };
      }

      // Kalau bukan todo yang diklik, kembalikan apa adanya
      return todo;
    });

    setTodos(todosBaru); // Update state dengan array yang sudah diubah
  };

  // Fungsi ini dipanggil saat user klik tombol "Hapus"
  const handleHapus = (id) => {

    // .filter() → Method Array: membuat array BARU hanya dengan elemen yang lolos syarat
    // Mirip "saring — ambil yang memenuhi kondisi, buang yang tidak"
    // Di sini kita ambil semua todo yang id-nya BUKAN id yang mau dihapus
    const todosSisa = todos.filter((todo) => todo.id !== id);

    setTodos(todosSisa);
  };

  // Fungsi untuk menghapus semua todo yang sudah selesai
  const hapusSelesai = () => {
    // .filter() lagi — kali ini ambil hanya yang belum selesai
    setTodos(todos.filter((todo) => !todo.selesai));
  };

  // ----------------------------------------------------------
  // VARIABEL TURUNAN (dihitung dari state yang ada)
  // ----------------------------------------------------------

  // .filter() → hitung berapa todo yang belum selesai
  const jumlahBelumSelesai = todos.filter((todo) => !todo.selesai).length;
  //                                                                  ↑
  //                         .length → properti Array: jumlah elemen dalam array

  // ----------------------------------------------------------
  // RENDER — Tampilan HTML yang dikembalikan
  // ----------------------------------------------------------

  return (
    // JSX: sintaks gabungan HTML + JavaScript milik React
    // className dipakai sebagai pengganti 'class' di HTML biasa (karena 'class' adalah keyword JS)

    <main style={styles.halaman}>

      <div style={styles.kartu}>

        {/* Judul aplikasi */}
        <h1 style={styles.judul}>📝 Todo List</h1>

        {/* Info jumlah todo tersisa */}
        {/* Template literal (`...`) → cara menulis string yang bisa sisipkan variabel dengan ${} */}
        <p style={styles.info}>{jumlahBelumSelesai} todo belum selesai</p>

        {/* -------------------------------------------------- */}
        {/* AREA INPUT */}
        {/* -------------------------------------------------- */}
        <div style={styles.barisTambah}>

          <input
            style={styles.input}
            type="text"
            placeholder="Tulis todo baru..."
            value={input} // Nilai input dikontrol oleh state 'input' (Controlled Component)

            // onChange → Event DOM: terpanggil setiap kali user mengetik sesuatu
            // 'e' adalah objek Event dari browser
            // e.target → DOM: merujuk ke elemen HTML yang memicu event (yaitu <input> ini)
            // e.target.value → nilai teks yang ada di dalam <input> saat ini
            onChange={(e) => setInput(e.target.value)}

            // onKeyDown → Event DOM: terpanggil saat user menekan tombol keyboard
            // e.key → properti Event: nama tombol yang ditekan (misal "Enter", "Escape")
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTambah(); // Tambah kalau tekan Enter
            }}
          />

          <button style={styles.tombolTambah} onClick={handleTambah}>
            {/* onClick → Event DOM: terpanggil saat user mengklik elemen */}
            Tambah
          </button>

        </div>

        {/* -------------------------------------------------- */}
        {/* DAFTAR TODO */}
        {/* -------------------------------------------------- */}

        {/* Kondisi: tampilkan pesan kosong kalau belum ada todo */}
        {/* && → Short-circuit: kalau kiri false/0/null, bagian kanan tidak dirender */}
        {todos.length === 0 && (
          <p style={styles.kosong}>Belum ada todo. Tambahkan sesuatu! 🎯</p>
        )}

        {/* .map() di JSX: mengubah setiap item array menjadi elemen JSX */}
        {/* Setiap elemen HARUS punya prop 'key' yang unik agar React bisa melacaknya */}
        <ul style={styles.daftar}>
          {todos.map((todo) => (
            <li key={todo.id} style={styles.item}>

              {/* Teks todo — stylenya berubah tergantung status 'selesai' */}
              {/* Ternary operator: kondisi ? nilaiKalauTrue : nilaiKalauFalse */}
              <span
                style={{
                  ...styles.teksTodo,
                  // Kalau selesai, tambahkan coret (line-through)
                  textDecoration: todo.selesai ? "line-through" : "none",
                  opacity: todo.selesai ? 0.5 : 1,
                }}
                // onClick pada teks: klik untuk toggle selesai/belum
                onClick={() => handleToggle(todo.id)}
              >
                {/* Emoji berubah sesuai status */}
                {todo.selesai ? "✅" : "⬜"} {todo.teks}
              </span>

              {/* Tombol hapus untuk todo ini */}
              <button
                style={styles.tombolHapus}
                onClick={() => handleHapus(todo.id)}
              >
                🗑️
              </button>

            </li>
          ))}
        </ul>

        {/* Tombol hapus semua yang selesai — hanya muncul kalau ada yang selesai */}
        {/* .some() → Method Array: mengecek apakah ADA SATU SAJA elemen yang memenuhi syarat */}
        {/* Mengembalikan true/false */}
        {todos.some((todo) => todo.selesai) && (
          <button style={styles.tombolBersih} onClick={hapusSelesai}>
            🧹 Hapus semua yang selesai
          </button>
        )}

      </div>

    </main>
  );
}

// ============================================================
// STYLES — Objek CSS-in-JS (ditulis sebagai objek JavaScript)
// ============================================================
// Di Next.js/React, style bisa ditulis inline sebagai objek JS
// Perbedaan: pakai camelCase (backgroundColor bukan background-color)

const styles = {
  halaman: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  kartu: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  },
  judul: {
    color: "#e2e8f0",
    fontSize: "2rem",
    fontWeight: "800",
    marginBottom: "4px",
    textAlign: "center",
    letterSpacing: "-0.5px",
  },
  info: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    textAlign: "center",
    marginBottom: "28px",
  },
  barisTambah: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#e2e8f0",
    fontSize: "1rem",
    outline: "none",
  },
  tombolTambah: {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  daftar: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "background 0.2s",
  },
  teksTodo: {
    color: "#e2e8f0",
    fontSize: "0.97rem",
    cursor: "pointer",
    flex: 1,
    userSelect: "none",
  },
  tombolHapus: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.1rem",
    marginLeft: "10px",
    opacity: 0.6,
  },
  kosong: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.95rem",
    marginBottom: "10px",
  },
  tombolBersih: {
    marginTop: "16px",
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid rgba(239,68,68,0.3)",
    background: "rgba(239,68,68,0.1)",
    color: "#f87171",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
};
