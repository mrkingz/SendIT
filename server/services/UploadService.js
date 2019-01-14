import path from 'path';
import multer from "multer";
import cloudinary from "cloudinary";
import cloudinaryStorage from "multer-storage-cloudinary";

/**
 *
 *
 * @export
 * @class UploadService
 */
export default class UploadService {
	/**
	 * Get Image format
	 *
	 * @static
	 * @returns {array} array of image format
	 * @method getImageFormat
	 * @memberof UploadService
	 */
	static getImageFormat() {
		return ['jpeg', 'jpg', 'png', 'gif'];
	}

  /**
   * Upload profile photo
   *
   * @static
   * @param {object} decoded authenticated user decoded token
   * @returns {Promie} A promise
   * @method uploadPhoto
   * @memberof UserController
   */
  static cloudinaryUpload(decoded) {
    cloudinary.config({
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      cloud_name: process.env.CLOUD_NAME
    });
    return multer({
      storage: cloudinaryStorage({
        cloudinary,
				folder: "sendit",
				allowedFormats: this.getImageFormat(),
        filename: (req, file, callback) => {
          callback(req, `${decoded.email}`);
        }
			}),
			limits: { fileSize: 1000000 },
			fileFilter: (req, file, callback) => {
				this.validatePhoto(file, callback);
			}
    }).single("photo");
	}
	
	/**
	 * Validate photo
	 *
	 * @static
	 * @param {object} file the file object
	 * @param {function} callback callback function
	 * @returns {function} result of the callback
	 * @method validatePhoto
	 * @memberof UploadService
	 */
	static validatePhoto(file, callback) {
		const fileTypes = /jpeg|jpg|png|gif/;
		const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
		const mimeType = fileTypes.test(file.mimetype);
		if (extName && mimeType) {
			return callback(null, true);
		}
		callback(new Error(`Photo format must be one of ${this.getImageFormat().join(', ')}`));
	}
}
