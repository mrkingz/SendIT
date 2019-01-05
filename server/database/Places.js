import UtilityService from '../services/UtilityService';

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
		return {
			Abia: [
				`Aba North`, `Aba South`, `Arochukwu`, `Bende`, `Ikwuano`, `Isiala-Ngwa North`,
				`Isiala-Ngwa South`, `Isuikwato`, `Obi Nwa`, `Ohafia`, `Osisioma`, `Ugwunagbo`,
				`Ukwa East`, `Ukwa West`, `Umuahia North`, `Umuahia South`, `Umu-Neochi`
			],
			Adamawa: [
				`Demsa`, `Fufore`, `Ganaye`, `Gireri`, `Gombi`, `Guyuk`, `Hong`, `Jada`, `Lamurde`,
				`Madagali`, `Maiha`, `Mayo Belwa`, `Michika`, `Mubi North`, `Mubi South`, `Numan`,
				`Shelleng`, `Song`, `Toungo`, `Yola North`, `Yola South`
			],
			'Akwa-Ibom': [
				`Abak`, `Eastern Obolo`, `Eket`, `Esit Eket`, `Essien Udim`, `Etim Ekpo`, `Etinan`, `Ibeno`,
				`Ibesikpo Asutan`, `Ibiono Ibom`, `Ika`, `Ikono`, `Ikot Abasi`, `Ikot Ekpene`, `Ini`, `Itu`,
				`Mbo`, `Mkpat Enin`, `Nsit Atai`, `Nsit Ibom`, `Nsit Ubium`, `Obot Akara`, `Okobo`, `Onna`,
				`Oron`, `Oruk Anam`, `Udung Uko`, `Ukanafun`, `Uruan`, `Urue-Offong/Oruko`, `Uyo`
			],
			Anambra: [
				`Aguata`, `Anambra East`, `Anambra West`, `Anaocha`, `Awka North`, `Awka South`,
				`Ayamelum`, `Dunukofia`, `Ekwusigo`, `Idemili North`, `Idemili south`, `Ihiala`,
				`Njikoka`, `Nnewi North`, `Nnewi South`, `Ogbaru`, `Onitsha North`, `Onitsha South`,
				`Orumba North`, `Orumba South`, `Oyi`,
			],
			Bauchi: [
				`Alkaleri`, `Bauchi`, `Bogoro`, `Damban`, `Darazo`, `Dass`, `Gamawa`, `Ganjuwa`, `Giade`,
				`Itas/Gadau`, `Jama''are`, `Katagum`, `Kirfi`, `Misau`, `Ningi`, `Shira`,
				`Tafawa-Balewa`, `Toro`, `Warji`, `Zaki`
			],
			Bayelsa: [
				`Brass`, `Ekeremor`, `Kolokuma/Opokuma`, `Nembe`, `Ogbia`,
				`Sagbama`, `Southern Jaw`, `Yenegoa`
			],
			Benue: [
				`Ado`, `Agatu`, `Apa`, `Buruku`, `Gboko`, `Guma`, `Gwer East`, `Gwer West`, `Katsina-ala`, 
				`Konshisha`, `Kwande`, `Logo`, `Makurdi`, `Obi`, `Ogbadibo`, `Ohimini`, `Oju`, `Okpokwu`, 
				`Oturkpo`, `Ushongo`, `Tarka`, `Ukum`, `Vandekya`
			],
			Borno: [
				`Abadam`, `Askira/Uba`, `Bama`, `Bayo`, `Biu`, `Chibok`, `Damboa`, `Dikwa`, `Gubio`, 
				`Guzamala`, `Gwoza`, `Hawul`, `Jere`, `Kaga`, `Kala/Balge`, `Konduga`, `Kukawa`, 
				`Kwaya Kusar`, `Mafa`, `Magumeri`, `Maiduguri`, `Marte`, `Mobbar`, `Monguno`, `Ngala`, 
				`Nganzai`, `Shani`,
			],
			'Crooss-River': [
				`Akpabuyo`, `Odukpani`, `Akamkpa`, `Biase`, `Abi`, `Ikom`, `Yarkur`, `Odubra`, `Boki`, 
				`Ogoja`, `Yala`, `Obanliku`, `Obudu`, `Calabar South`, `Etung`, `Bekwara`, `Bakassi`, 
				`Calabar Municipality`
			],
			Delta: [
				`Aniocha`, `Aniocha South`, `Bomadi`, `Burutu`, `Ethiope East`, `Ethiope West`,
				`Ika South`, `Ika North East`, `Isoko south`, `Isoko North`, `Ndokwa West`, `Ndokwa East`,
				`Okpe`, `Oshimili`, `Oshimili North`, `Patani`, `Sapele`, `Udu`, `Ughelli Northh`, 
				`Ughelli South`, `Ukwani`, `Uvwie`, `Warri North`, `Warri South-West`, `Warri Central`
			],
			Ebonyi: [
				`Afikpo South`, `Afikpo North`, `Onicha`, `Ohaozara`, `Abakaliki`, `Ishielu`, `lkwo`, 
				`Ezza`, `Ezza South`, `Ohaukwu`, `Ebonyi`, `Ivo`, `Izzi`
			],
			Edo: [
				`Akoko-Edo`, ` Egor`, `Esan Central`, `Essan North-East`, `Esan South-East`, `Esan West`, 
				`Etsako Central`, `Etsako East`, `Etsako East`, `Igueben`, `Ikpoba-Okha`, `Oredo`,
				`Orhionwon`, `Ovia North-East`, `Ovia South West`, `Owan Eest`, `Owan West`, `Uhunwonde`
			],
			Ekiti: [
				`Ado`, `Ekiti-East`, `Ekiti West`, `Emure/Ise/Orun`, `Ekiti South West`, `Ikare`, 
				`Irepodun`, `Ijero`, `Ido/Osi`, `Oye`, `Ikole`, `Moba`, `Gbonyin`, `Efon`, 
				`Ise/Orun`, `Ilejemeje`
			],
			Enugu: [
				`Awgu`, `Aninri`, `Enugu South`, `Igbo-Eze South`, `Enugu North`, `Nkanu`, `Udi Agwu`, 
				`Oji-River`, `Ezeagu`, `IgboEze North`, `Isi-Uzo`, `Nsukka`, `Igbo-Ekiti`, `Uzo-Uwani`, 
				`Enugu East`, `Nkanu East`, `Udenu`,
			],
			Gombe: [
				`Akko`, `Balanga`, `Billiri`, `Dukku`, `Kaltungo`, `Kwami`, `Shomgom`, `Funakaye`,
				`Gombe`, `Nafada/Bajoga`, `Yamaltu/Delta`
			],
			Imo: [
				`Aboh-Mbaise`, `Ahiazu-Mbaise`, `Ehime-Mbano`, `Ezinihitte`, `Ideato North`, `Ideato South`,
				`Ihitte/Uboma`, `Ikeduru`, `Isiala Mbano`, `Isu`, `Mbaitoli`, `Mbaitoli`, `Ngor-Okpala`,
				`Njaba`, `Nwangele`, `Nkwerre`, `Obowo`, `Oguta`, `Ohaji/Egbema`, `Okigwe`, `Orlu`, `Orsu`,
				`Oru East`, `Oru West`, `Owerri-Municipal`, `Owerri North`, `Owerri West`
			],
			Jigawa: [
				`Auyo`, `Babura`, `Birni Kudu`, `Biriniwa`, `Buji`, `Dutse`, `Gagarawa`, `Garki`, `Gumel`,
				`Guri`, `Gwaram`, `Gwiwa`, `Hadejia`, `Jahun`, `Kafin Hausa`, `Kaugama`, `Kazaure`,
				`Kiri Kasamma`, `Kiyawa`, `Maigatari`, `Malam Madori`, `Miga`, `Ringim`, `Roni`,
				`Sule-Tankarkar`, `Taura`, `Yankwashi`
			],
			Kaduna: [
				`Birni-Gwari`, `Chikun`, `Giwa`, `Igabi`, `Ikara`, `jaba`, `Jema''a`, `Kachia`,
				`Kaduna North`, `Kaduna South`, `Kagarko`, `Kajuru`, `Kaura`, `Kauru`, `Kubau`,
				`Kudan`, `Lere`, `Makarfi`, `Sabon-Gari`, `Sanga`, `Soba`, `Zango-Kataf`, `Zaria`,
			],
			Kano: [
				`Ajingi`, `Albasu`, `Bagwai`, `Bebeji`, `Bichi`, `Bunkure`, `Dala`, `Dambatta`,
				`Dawakin Kudu`, `Dawakin Tofa`, `Doguwa`, `Fagge`, `Gabasawa`, `Garko`, `Garum Mallam`,
				`Gaya`, `Gezawa`, `Gwale`, `Gwarzo`, `Kabo`, `Kano Municipal`, `Karaye`, `Kibiya`, 
				`Kiru`, `kumbotso`, `Kunchi`, `Kura`, `Madobi`, `Makoda`, `Minjibir`, `Nasarawa`, 
				`Rano`, `Rimin Gado`, `Rogo`, `Shanono`, `Sumaila`, `Takali`, `Tarauni`, `Tofa`, 
				`Tsanyawa`, `Tudun Wada`, `Ungogo`, `Warawa`, `Wudil`
			],
			Katsina: [
				`Bakori`, `Batagarawa`, `Batsari`, `Baure`, `Bindawa`, `Charanchi`, `Dandume`, `Danja`,
				`Dan Musa`, `Daura`, `Dutsi`, `Dutsin-Ma`, `Faskari`, `Funtua`, `Ingawa`, `Jibia`, `Kafur`,
				`Kaita`, `Kankara`, `Kankia`, `Katsina`, `Kurfi`, `Kusada`, `Mai''Adua`, `Malumfashi`,
				`Mani`, `Mashi`, `Matazuu`, `Musawa`, `Rimi`, `Sabuwa`, `Safana`, `Sandamu`, `Zango`
			],
			Kebbi: [
				`Aleiro`, `Arewa-Dandi`, `Argungu`, `Augie`, `Bagudo`, `Birnin Kebbi`, `Bunza`, `Dandi`,
				`Danko`, `Fakai`, `Gwandu`, `Jega`, `Kalgo`, `Koko/Besse`, `Maiyama`, `Ngaski`, `Sakaba`, 
				`Shanga`, `Suru`, `Wasagu`, `Yauri`, `Zuru`
			],
			Kogi: [
				`Adavi`, `Ajaokuta`, `Ankpa`, `Bassa`, `Dekina`, `Ibaji`, `Idah`, `Igalamela-Odolu`, 
				`Ijumu`, `Kabba/Bunu`, `Kogi`, `Mopa-Muro`, `Ofu`, `Ogori/Mangongo`, `Okehi`, `Okene`, 
				`Olamabolo`, `Omala`, `Yagba East`, `Yagba West`
			],
			Kwara: [
				`Asa`, `Baruten`, `Ede`, `Ekiti`, `Ifelodun`, `Ilorin East`, `Ilorin West`, `Ilorin South`,
				`Irepodun`, `Isin`, `Kaiama`, `Moro`, `Offa`, `Oke-Ero`, `Oyun`, `Pategi`
			],
			Lagos: [
				`Agege`, `Ajeromi-Ifelodun`, `Alimosho`, `Amuwo-Odofin`, `Apapa`, `Badagry`, `Epe`, 
				`Eti-Osa`, `Ibeju/Lekki`, `Ifako-Ijaye`, `Ikeja`, `Ikorodu`, `Kosofe`, `Lagos Island`, 
				`Lagos Mainland`, `Mushin`, `Ojo`, `Oshodi-Isolo`, `Shomolu`, `Surulere`,
			],
			Nasarawa: [
				`Akwanga`, `Awe`, `Doma`, `Karu`, `Keana`, `Keffi`, `Kokona`, `Lafia`, `Nasarawa`, 
				`Nasarawa-Eggon`, `Obi`, `Toto`, `Wamba`
			],
			Niger: [
				`Agaie`, `Agwara`, `Bida`, `Borgu`, `Bosso`, `Chanchaga`, `Edati`, `Gbako`, `Gurara`, 
				`Katcha`, `Kontagora`, `Lapai`, `Lavun`, `Magama`, `Mariga`, `Mashegu`, `Mokwa`, `Muya`, 
				`Pailoro`, `Rafi`, `Rijau`, `Shiroro`, `Suleja`, `Tafa`, `Wushishi`
			],
			Ogun: [
				`Abeokuta North`, `Abeokuta South`, `Ado-Odo/Ota`, `Egbado North`, `Egbado South`, 
				`Ewekoro`, `Ifo`, `Ijebu East`, `Ijebu North`, `Ijebu North East`, `Ijebu Ode`, 
				`Ikenne`, `Imeko-Afon`, `Ipokia`, `Obafemi-Owode`, `Ogun Waterside`, `Odeda`, 
				`Odogbolu`, `Remo North`, `Shagamu`
			],
			Ondo: [
				`Akoko North East`, `Akoko North West`, `Akoko South Akure East`, `Akoko South West`,
				`Akure North`, `Akure South`, `Ese-Odo`, `Idanre`, `Ifedore`, `Ilaje`, `Ile-Oluji/Okeigbo`, 
				`Irele`, `Odigbo`, `Okitipupa`, `Ondo East`, `Ondo West`, `Ose`, `Owo`
			],
			Osun: [
				`Aiyedade`, `Aiyedire`, `Atakumosa East`, `Atakumosa West`, `Boluwaduro`, `Boripe`,
				`Ede North`, `Ede South`, `Egbedore`, `Ejigbo`, `Ife Central`, `Ife East`, `Ife North`,
				`Ife South`, `Ifedayo`, `Ifelodun`, `Ila`, `Ilesha East`, `Ilesha West`, `Irepodun`,
				`Irewole`, `Isokan`, `Iwo`, `Obokun`, `Odo-Otin`, `Ola-Oluwa`, `Olorunda`, `Oriade`,
				`Orolu`, `Osogbo`
			],
			Oyo: [
				`Afijio`, `Akinyele`, `Atiba`, `Atigbo`, `Egbeda`, `Ibadan Central`, `Ibadan North`,
				`Ibadan North West`, `Ibadan South East`, `Ibadan South West`, `Ibarapa Central`,
				`Ibarapa East`, `Ibarapa North`, `Ido`, `Irepo`, `Iseyin`, `Itesiwaju`, `Iwajowa`,
				`Kajola`, `Lagelu`, `Ogbomosho North`, `Ogbmosho South`, `Ogo Oluwa`, `Olorunsogo`,
				`Oluyole`, `Ona-Ara`, `Orelope`, `Ori Ire`, `Oyo East`, `Oyo West`, `Saki East`,
				`Saki West`, `Surulere`
			],
			Pleatue: [
				`Barikin Ladi`, `Bassa`, `Bokkos`, `Jos East`, `Jos North`, `Jos South`, `Kanam`,
				`Kanke`, `Langtang North`, `Langtang South`, `Mangu`, `Mikang`, `Pankshin`, `Qua''an Pan`,
				`Riyom`, `Shendam`, `Wase`
			],
			Rivers: [
				`Abua/Odual`, `Ahoada East`, `Ahoada West`, `Akuku Toru`, `Andoni`, `Asari-Toru`, `Bonny`,
				`Degema`, `Emohua`, `Eleme`, `Etche`, `Gokana`, `Ikwerre`, `Khana`, `Obia/Akpor`,
				`Ogba/Egbema/Ndoni`, `Ogu/Bolo`, `Okrika`, `Omumma `, `Opobo/Nkoro`, `Oyigbo`, 
				`Port-Harcourt`, `Tai`
			],
			Sokoto: [
				`Binji`, `Bodinga`, `Dange-shnsi`, `Gada`, `Goronyo`, `Gudu`, `Gawabawa`, `Illela`, `Isa`, 
				`Kware`, `kebbe`, `Rabah`, `Sabon birni`, `Shagari`, `Silame`, `Sokoto North`, 
				`Sokoto South`, `Tambuwal`, `Tqngaza`, `Tureta`, `Wamako`, `Wurno`, `Yabo`
			],
			Taraba: [
				`Ardo-kola`, `Bali`, `Donga`, `Gashaka`, `Cassol`, `Ibi`, `Jalingo`, `Karin-Lamido`, 
				`Kurmi`, `Lau`, `Sardauna`, `Takum`, `Ussa`, `Wukari`, `Yorro`, `Zing`
			],
			Yobe: [
				`Bade`, `Bursari`, `Damaturu`, `Fika`, `Fune`, `Geidam`, `Gujba`, `Gulani`, `Jakusko`,
				`Karasuwa`, `Karawa`, `Machina`, `Nangere`, `Nguru Potiskum`, `Tarmua`, `Yunusari`, 
				`Yusufari`
			],
			Zamfara: [
				`Anka`, `Bakura`, `Birnin Magajii/Kiyaw`, `Bukkuyum`, `Bungudu`, `Gummi`, `Gusau`, 
				`Kaura Namoda`, `Maradun`, `Maru`, `Shinkafi`, `Talata Mafara`, `Tsafe`, `Zurmi`
			],
			'Federal-Capital-Territory': [
				`Gwagwalada`, `Kuje`, `Abaji`, `Abuja Municipal`, `Bwari`, `Kwali`,
			]
		};
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