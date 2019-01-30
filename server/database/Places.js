import fs from "fs";
import path from "path";
import UtilityService from "../services/UtilityService";

/**
 *
 *
 * @export
 * @class Places
 * @extends {UtilityService}
 */
export default class Places extends UtilityService {
  /**
   * Get places
   *
   * @static
   * @returns {object} object containing places
   * @method getPlaces
   * @memberof Places
   */
  static getPlaces() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "/places.json")));
  }

  /**
   * Get all states
   *
   * @static
   * @returns {array} array of places
   * @method getStates
   * @memberof Places
   */
  static getStates() {
    return Object.keys(this.getPlaces());
  }

  /**
   * Get local governments areas of a particular
   *
   * @static
   * @param {string} state
   * @returns {array} array of local government areas
   * @method getLGAs
   * @memberof Places
   */
  static getLGAs(state) {
    return this.getPlaces()[state];
  }
}
