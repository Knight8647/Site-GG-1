import { db } from './firebase.js';
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const cards = document.querySelectorAll('.presente');

cards.forEach((card) => {
  const botao = card.querySelector('button');
  const id = card.dataset.id;

  const ref = doc(db, 'presentes', id);

  // ESCUTA EM TEMPO REAL
  onSnapshot(ref, (snapshot) => {
    if (snapshot.exists() && snapshot.data().comprado === true) {
      botao.disabled = true;
      botao.innerText = 'Presenteado ❤️';
      botao.style.background = '#22c55e';
      card.style.opacity = '0.6';
    }
  });

  botao.addEventListener('click', async () => {
    const confirmar = confirm('Deseja confirmar este presente? 💝');
    if (!confirmar) return;

    // CRIA ou ATUALIZA (não dá erro)
    await setDoc(ref, {
      comprado: true
    }, { merge: true });
  });
});