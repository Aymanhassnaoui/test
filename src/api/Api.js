async function afficherCards() {
    const reponse = await fetch('https://randomuser.me/api/?results=10');
    const data = await reponse.json();
   
    if (!Array.isArray(data.results)) {
      console.error("Les données reçues ne sont pas sous forme de tableau !");
      return [];
  }     

  const utilisateurs = data.results.slice(0, 10); // Récupère les 30 premiers utilisateurs

    console.log(utilisateurs);
    return utilisateurs;
}

export { afficherCards };
