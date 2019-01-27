import path from 'path';
import multer from "multer";
import cloudinary from "cloudinary";
import cloudinaryStorage from "multer-storage-cloudinary";
import configs from '../configs';

cloudinary.config(configs.cloudinaryConfig);

/**
 *
 *
 * @export
 * @class UploadService
 */
export default class UploadService {
	/**
	 * Get the name of the folder where photos are saved
	 *
	 * @static
	 * @returns {string} the folder name
	 * @memberof UploadService
	 */
	static getFolderName() {
			return 'sendit';
	}

	/**
	 * The cloudinary photo url
	 *
	 * @static
	 * @param {string} user
	 * @returns {string} the public id
	 * @memberof UploadService
	 */
	static getImagePublicId(user) {
		// Remember we renamed photo to user's email
		return `${this.getFolderName()}/${user.email}`;
	}

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
  static uploadTocloudinary(decoded) {
    return multer({
      storage: cloudinaryStorage({
        cloudinary,
				folder: this.getFolderName(),
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
	 * Deletevimage from cloudinary storage
	 *
	 * @static
	 * @param {string} user the user whose photo we want to delete
	 * @memberof UploadService
	 */
	static deleteCloudinaryImage(user) {
		cloudinary.uploader.destroy(this.getImagePublicId(user));
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
