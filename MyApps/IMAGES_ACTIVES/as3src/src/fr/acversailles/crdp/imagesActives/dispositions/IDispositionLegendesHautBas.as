﻿ /**
 * Copyright (c) 2011 Centre Régional de Documentation Pédagogique de l'Académie de Versailles 
 * Images Actives is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * at your option) any later version.
 * Images Actives is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with Images Actives.  If not, see <http://www.gnu.org/licenses/>.
 **/
package fr.acversailles.crdp.imagesActives.dispositions {
	import flash.geom.Point;

	/**
	 * @author Joachim Dornbusch CRDP Académie de Versailles
	 */
	public interface IDispositionLegendesHautBas extends IDispositionAvecDefilement {
		function getLargeurSelecteurs() : Number;

		function getPositionSelecteur(i : int) : Point;

		function getMargeInfSelecteurs() : Number;

		function getMargeInfLegende() : Number;

		function getPosition() : uint;


	}
}