
function infos(element, numa, masseatomique, electroneg, ptfus, ptebul) {
	
	var a = document.getElementById("checklewis").checked; /* variable a = true si la case lewis est coch�e, sinon a = false */
	
	/* si le nom de la case Lewis est coch�e, la fonction affiche le nom de l'�l�ment et sa repr�sentation de lewis dans la 'div_infos' */
	if (a == true) {
		document.getElementById("div_infos").innerHTML = "<h3>"+element+"</h3>" +'<img src="Images/'+numa+'.svg">';	
	}
	
	/* si la case n'est pas coch�e, la fonction affiche les infos relatives � l'�l�ment dans la 'div_infos' */
	else {
		document.getElementById("div_infos").innerHTML = "<h3>"+element+"</h3>" + "<table id='table_infos'>"
																						+"<tr>"
																							+"<td class='colonne1'>Num�ro atomique:</td>"
																							+"<td class='colonne2'>" +numa+ "</td>"
																							+"<td class='colonne3'>Protons:</td>"
																							+"<td>"+numa+"</td>"
																						+"</tr>"
																						+"<tr>"
																							+"<td class='colonne1'>Masse atomique:</td>"
																							+"<td class='colonne2'>" +masseatomique+ "</td>"
																							+"<td class='colonne3'>Electrons:</td>"
																							+"<td>"+numa+"</td>"
																						+"</tr>"
																						+"<tr>"
																							+"<td class='colonne1'>Electron�gativit�:</td>"
																							+"<td class='colonne2'>"+electroneg+"</td>"
																							+"<td class='colonne3'>Neutrons:</td>"
																							+"<td>"+parseInt(masseatomique-numa)+"</td>"
																						+"</tr>"
																						+"<tr>"
																							+"<td class='colonne1'>Point de fusion:</td>"
																							+"<td class='colonne2'>"+ptfus+"</td>"
																						+"</tr>"
																						+"<tr>"
																							+"<td class='colonne1'>Point d'�bullition:</td>"
																							+"<td class='colonne2'>"+ptebul+"</td>"
																						+"</tr>"
																					+"</table>";
	}	
		
}
