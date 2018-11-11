import collections from '../collections';
import UtilityService from '../services/utilityService';


/**
 * @export
 * @class ParcelController
 * @extends { UtilityService }
 */
export default class ParcelController extends UtilityService {
	/**
	 * 
	 * @static
	 * @returns {function} A middleware function that handles the POST request
	 * @memberof ParcelController
	 */
	static createParcel() {
		return (req, res) => {
			const days = { fast: '3 days', normal: '7 days' };
			const { decoded, ...parcelDetails } = req.body;
			const moment = new Date();
			parcelDetails.parcelId = collections.getParcels().length + 1;
			parcelDetails.userId = decoded.userId;
			parcelDetails.price = Number(req.body.weight) * 100;
			parcelDetails.deliveryStatus = 'Pending';
			parcelDetails.presentLocation = 'Not available';
			parcelDetails.deliveryDuration = days[req.body.deliveryMethod.toLowerCase()];
			parcelDetails.createdAt = moment;
			parcelDetails.updatedAt = moment;
			collections.addParcels(parcelDetails);
			return this.successResponse(res, 201, 'Parcel delivery order successfully created', {
					...collections.getParcels()[collections.getParcels().length - 1],
				});
		};
	}

  /**
   * Gets a signle user's parcel
   * @static
   * @returns {function} Returns an express middleware function that handles the GET request
   * @memberof ParcelController
   */
  static getParcel() {
    return (req, res) => {
      let parcel;
      const parcelId = req.params.parcelId;
      const length = collections.getParcels().length;
      for (let i = 0; i < length; i++) {
        if (parseInt(collections.getParcels()[i].parcelId, 10) === parseInt(parcelId, 10)) {
          parcel = collections.getParcels()[i];
          break;
        }
			}
			
      return (parcel) 
				? this.successResponse(res, 200, undefined, parcel)
				: this.errorResponse(res, 404, 'Parcel not found');
    };
  }
}