(function(){
  'use strict';

  angular
    .module('app')
    .constant('constants', constants);

  constants.$inject = [];

  function constants(){
    return {
      'DEFAULT_SETTINGS': {
        'remember': false,
        'email': "",
        'units': "standard",
        'help': {
          'all': false,
          'home': false,
          'profile': false,
          'locations': false,
          'company': false,
          'friends': false,
          'points': false,
          'settings': false,
          'favorites': false,
          'quickWorkout': false,
          'reviewWorkout': false,
          'exercise': false,
          'reviewPost': false
        },
        'minimizeExerciseImage': true,
        'minimizeWorkoutHistory': true,
        'sound': true,
        'theme': "UpDown"
      },

      'COUNTRIES': [
                     {'country_code':"US", 'name': "United States"},
                     {'country_code':"AF", 'name':"Afghanistan"},
                     {'country_code':"AX", 'name':"Aland Islands"},
                     {'country_code':"AL", 'name':"Albania"},
                     {'country_code':"DZ", 'name':"Algeria"},
                     {'country_code':"AS", 'name':"American Samoa"},
                     {'country_code':"AD", 'name':"Andorra"},
                     {'country_code':"AO", 'name':"Angola"},
                     {'country_code':"AI", 'name':"Anguilla"},
                     {'country_code':"AQ", 'name':"Antarctica"},
                     {'country_code':"AG", 'name':"Antigua and Barbuda"},
                     {'country_code':"AR", 'name':"Argentina"},
                     {'country_code':"AM", 'name':"Armenia"},
                     {'country_code':"AW", 'name':"Aruba"},
                     {'country_code':"AU", 'name':"Australia"},
                     {'country_code':"AT", 'name':"Austria"},
                     {'country_code':"AZ", 'name':"Azerbaijan"},
                     {'country_code':"BS", 'name':"Bahamas"},
                     {'country_code':"BH", 'name':"Bahrain"},
                     {'country_code':"BD", 'name':"Bangladesh"},
                     {'country_code':"BB", 'name':"Barbados"},
                     {'country_code':"BY", 'name':"Belarus"},
                     {'country_code':"BE", 'name':"Belgium"},
                     {'country_code':"BZ", 'name':"Belize"},
                     {'country_code':"BJ", 'name':"Benin"},
                     {'country_code':"BM", 'name':"Bermuda"},
                     {'country_code':"BT", 'name':"Bhutan"},
                     {'country_code':"BO", 'name':"Bolivia, Plurinational State of"},
                     {'country_code':"BQ", 'name':"Bonaire, Sint Eustatius and Saba"},
                     {'country_code':"BA", 'name':"Bosnia and Herzegovina"},
                     {'country_code':"BW", 'name':"Botswana"},
                     {'country_code':"BV", 'name':"Bouvet Island"},
                     {'country_code':"BR", 'name':"Brazil"},
                     {'country_code':"IO", 'name':"British Indian Ocean Territory"},
                     {'country_code':"BN", 'name':"Brunei Darussalam"},
                     {'country_code':"BG", 'name':"Bulgaria"},
                     {'country_code':"BF", 'name':"Burkina Faso"},
                     {'country_code':"BI", 'name':"Burundi"},
                     {'country_code':"KH", 'name':"Cambodia"},
                     {'country_code':"CM", 'name':"Cameroon"},
                     {'country_code':"CA", 'name':"Canada"},
                     {'country_code':"CV", 'name':"Cape Verde"},
                     {'country_code':"KY", 'name':"Cayman Islands"},
                     {'country_code':"CF", 'name':"Central African Republic"},
                     {'country_code':"TD", 'name':"Chad"},
                     {'country_code':"CL", 'name':"Chile"},
                     {'country_code':"CN", 'name':"China"},
                     {'country_code':"CX", 'name':"Christmas Island"},
                     {'country_code':"CC", 'name':"Cocos (Keeling) Islands"},
                     {'country_code':"CO", 'name':"Colombia"},
                     {'country_code':"KM", 'name':"Comoros"},
                     {'country_code':"CG", 'name':"Congo"},
                     {'country_code':"CD", 'name':"Congo, the Democratic Republic of the"},
                     {'country_code':"CK", 'name':"Cook Islands"},
                     {'country_code':"CR", 'name':"Costa Rica"},
                     {'country_code':"CI", 'name':"Cote d'Ivoire"},
                     {'country_code':"HR", 'name':"Croatia"},
                     {'country_code':"CU", 'name':"Cuba"},
                     {'country_code':"CW", 'name':"Curacao"},
                     {'country_code':"CY", 'name':"Cyprus"},
                     {'country_code':"CZ", 'name':"Czech Republic"},
                     {'country_code':"DK", 'name':"Denmark"},
                     {'country_code':"DJ", 'name':"Djibouti"},
                     {'country_code':"DM", 'name':"Dominica"},
                     {'country_code':"DO", 'name':"Dominican Republic"},
                     {'country_code':"EC", 'name':"Ecuador"},
                     {'country_code':"EG", 'name':"Egypt"},
                     {'country_code':"SV", 'name':"El Salvador"},
                     {'country_code':"GQ", 'name':"Equatorial Guinea"},
                     {'country_code':"ER", 'name':"Eritrea"},
                     {'country_code':"EE", 'name':"Estonia"},
                     {'country_code':"ET", 'name':"Ethiopia"},
                     {'country_code':"FK", 'name':"Falkland Islands (Malvinas)"},
                     {'country_code':"FO", 'name':"Faroe Islands"},
                     {'country_code':"FJ", 'name':"Fiji"},
                     {'country_code':"FI", 'name':"Finland"},
                     {'country_code':"FR", 'name':"France"},
                     {'country_code':"GF", 'name':"French Guiana"},
                     {'country_code':"PF", 'name':"French Polynesia"},
                     {'country_code':"TF", 'name':"French Southern Territories"},
                     {'country_code':"GA", 'name':"Gabon"},
                     {'country_code':"GM", 'name':"Gambia"},
                     {'country_code':"GE", 'name':"Georgia"},
                     {'country_code':"DE", 'name':"Germany"},
                     {'country_code':"GH", 'name':"Ghana"},
                     {'country_code':"GI", 'name':"Gibraltar"},
                     {'country_code':"GR", 'name':"Greece"},
                     {'country_code':"GL", 'name':"Greenland"},
                     {'country_code':"GD", 'name':"Grenada"},
                     {'country_code':"GP", 'name':"Guadeloupe"},
                     {'country_code':"GU", 'name':"Guam"},
                     {'country_code':"GT", 'name':"Guatemala"},
                     {'country_code':"GG", 'name':"Guernsey"},
                     {'country_code':"GN", 'name':"Guinea"},
                     {'country_code':"GW", 'name':"Guinea-Bissau"},
                     {'country_code':"GY", 'name':"Guyana"},
                     {'country_code':"HT", 'name':"Haiti"},
                     {'country_code':"HM", 'name':"Heard Island and McDonald Islands"},
                     {'country_code':"VA", 'name':"Holy See (Vatican City State)"},
                     {'country_code':"HN", 'name':"Honduras"},
                     {'country_code':"HK", 'name':"Hong Kong"},
                     {'country_code':"HU", 'name':"Hungary"},
                     {'country_code':"IS", 'name':"Iceland"},
                     {'country_code':"IN", 'name':"India"},
                     {'country_code':"ID", 'name':"Indonesia"},
                     {'country_code':"IR", 'name':"Iran, Islamic Republic of"},
                     {'country_code':"IQ", 'name':"Iraq"},
                     {'country_code':"IE", 'name':"Ireland"},
                     {'country_code':"IM", 'name':"Isle of Man"},
                     {'country_code':"IL", 'name':"Israel"},
                     {'country_code':"IT", 'name':"Italy"},
                     {'country_code':"JM", 'name':"Jamaica"},
                     {'country_code':"JP", 'name':"Japan"},
                     {'country_code':"JE", 'name':"Jersey"},
                     {'country_code':"JO", 'name':"Jordan"},
                     {'country_code':"KZ", 'name':"Kazakhstan"},
                     {'country_code':"KE", 'name':"Kenya"},
                     {'country_code':"KI", 'name':"Kiribati"},
                     {'country_code':"KP", 'name':"Korea, Democratic People's Republic of"},
                     {'country_code':"KR", 'name':"Korea, Republic of"},
                     {'country_code':"KW", 'name':"Kuwait"},
                     {'country_code':"KG", 'name':"Kyrgyzstan"},
                     {'country_code':"LA", 'name':"Lao People's Democratic Republic"},
                     {'country_code':"LV", 'name':"Latvia"},
                     {'country_code':"LB", 'name':"Lebanon"},
                     {'country_code':"LS", 'name':"Lesotho"},
                     {'country_code':"LR", 'name':"Liberia"},
                     {'country_code':"LY", 'name':"Libya"},
                     {'country_code':"LI", 'name':"Liechtenstein"},
                     {'country_code':"LT", 'name':"Lithuania"},
                     {'country_code':"LU", 'name':"Luxembourg"},
                     {'country_code':"MO", 'name':"Macao"},
                     {'country_code':"MK", 'name':"Macedonia, the former Yugoslav Republic of"},
                     {'country_code':"MG", 'name':"Madagascar"},
                     {'country_code':"MW", 'name':"Malawi"},
                     {'country_code':"MY", 'name':"Malaysia"},
                     {'country_code':"MV", 'name':"Maldives"},
                     {'country_code':"ML", 'name':"Mali"},
                     {'country_code':"MT", 'name':"Malta"},
                     {'country_code':"MH", 'name':"Marshall Islands"},
                     {'country_code':"MQ", 'name':"Martinique"},
                     {'country_code':"MR", 'name':"Mauritania"},
                     {'country_code':"MU", 'name':"Mauritius"},
                     {'country_code':"YT", 'name':"Mayotte"},
                     {'country_code':"MX", 'name':"Mexico"},
                     {'country_code':"FM", 'name':"Micronesia, Federated States of"},
                     {'country_code':"MD", 'name':"Moldova, Republic of"},
                     {'country_code':"MC", 'name':"Monaco"},
                     {'country_code':"MN", 'name':"Mongolia"},
                     {'country_code':"ME", 'name':"Montenegro"},
                     {'country_code':"MS", 'name':"Montserrat"},
                     {'country_code':"MA", 'name':"Morocco"},
                     {'country_code':"MZ", 'name':"Mozambique"},
                     {'country_code':"MM", 'name':"Myanmar"},
                     {'country_code':"NA", 'name':"Namibia"},
                     {'country_code':"NR", 'name':"Nauru"},
                     {'country_code':"NP", 'name':"Nepal"},
                     {'country_code':"NL", 'name':"Netherlands"},
                     {'country_code':"NC", 'name':"New Caledonia"},
                     {'country_code':"NZ", 'name':"New Zealand"},
                     {'country_code':"NI", 'name':"Nicaragua"},
                     {'country_code':"NE", 'name':"Niger"},
                     {'country_code':"NG", 'name':"Nigeria"},
                     {'country_code':"NU", 'name':"Niue"},
                     {'country_code':"NF", 'name':"Norfolk Island"},
                     {'country_code':"MP", 'name':"Northern Mariana Islands"},
                     {'country_code':"NO", 'name':"Norway"},
                     {'country_code':"OM", 'name':"Oman"},
                     {'country_code':"PK", 'name':"Pakistan"},
                     {'country_code':"PW", 'name':"Palau"},
                     {'country_code':"PS", 'name':"Palestinian Territory, Occupied"},
                     {'country_code':"PA", 'name':"Panama"},
                     {'country_code':"PG", 'name':"Papua New Guinea"},
                     {'country_code':"PY", 'name':"Paraguay"},
                     {'country_code':"PE", 'name':"Peru"},
                     {'country_code':"PH", 'name':"Philippines"},
                     {'country_code':"PN", 'name':"Pitcairn"},
                     {'country_code':"PL", 'name':"Poland"},
                     {'country_code':"PT", 'name':"Portugal"},
                     {'country_code':"PR", 'name':"Puerto Rico"},
                     {'country_code':"QA", 'name':"Qatar"},
                     {'country_code':"RE", 'name':"Reunion"},
                     {'country_code':"RO", 'name':"Romania"},
                     {'country_code':"RU", 'name':"Russian Federation"},
                     {'country_code':"RW", 'name':"Rwanda"},
                     {'country_code':"BL", 'name':"Saint Barthelemy"},
                     {'country_code':"SH", 'name':"Saint Helena, Ascension and Tristan da Cunha"},
                     {'country_code':"KN", 'name':"Saint Kitts and Nevis"},
                     {'country_code':"LC", 'name':"Saint Lucia"},
                     {'country_code':"MF", 'name':"Saint Martin (French part)"},
                     {'country_code':"PM", 'name':"Saint Pierre and Miquelon"},
                     {'country_code':"VC", 'name':"Saint Vincent and the Grenadines"},
                     {'country_code':"WS", 'name':"Samoa"},
                     {'country_code':"SM", 'name':"San Marino"},
                     {'country_code':"ST", 'name':"Sao Tome and Principe"},
                     {'country_code':"SA", 'name':"Saudi Arabia"},
                     {'country_code':"SN", 'name':"Senegal"},
                     {'country_code':"RS", 'name':"Serbia"},
                     {'country_code':"SC", 'name':"Seychelles"},
                     {'country_code':"SL", 'name':"Sierra Leone"},
                     {'country_code':"SG", 'name':"Singapore"},
                     {'country_code':"SX", 'name':"Sint Maarten (Dutch part)"},
                     {'country_code':"SK", 'name':"Slovakia"},
                     {'country_code':"SI", 'name':"Slovenia"},
                     {'country_code':"SB", 'name':"Solomon Islands"},
                     {'country_code':"SO", 'name':"Somalia"},
                     {'country_code':"ZA", 'name':"South Africa"},
                     {'country_code':"GS", 'name':"South Georgia and the South Sandwich Islands"},
                     {'country_code':"SS", 'name':"South Sudan"},
                     {'country_code':"ES", 'name':"Spain"},
                     {'country_code':"LK", 'name':"Sri Lanka"},
                     {'country_code':"SD", 'name':"Sudan"},
                     {'country_code':"SR", 'name':"Suriname"},
                     {'country_code':"SJ", 'name':"Svalbard and Jan Mayen"},
                     {'country_code':"SZ", 'name':"Swaziland"},
                     {'country_code':"SE", 'name':"Sweden"},
                     {'country_code':"CH", 'name':"Switzerland"},
                     {'country_code':"SY", 'name':"Syrian Arab Republic"},
                     {'country_code':"TW", 'name':"Taiwan, Province of China"},
                     {'country_code':"TJ", 'name':"Tajikistan"},
                     {'country_code':"TZ", 'name':"Tanzania, United Republic of"},
                     {'country_code':"TH", 'name':"Thailand"},
                     {'country_code':"TL", 'name':"Timor-Leste"},
                     {'country_code':"TG", 'name':"Togo"},
                     {'country_code':"TK", 'name':"Tokelau"},
                     {'country_code':"TO", 'name':"Tonga"},
                     {'country_code':"TT", 'name':"Trinidad and Tobago"},
                     {'country_code':"TN", 'name':"Tunisia"},
                     {'country_code':"TR", 'name':"Turkey"},
                     {'country_code':"TM", 'name':"Turkmenistan"},
                     {'country_code':"TC", 'name':"Turks and Caicos Islands"},
                     {'country_code':"TV", 'name':"Tuvalu"},
                     {'country_code':"UG", 'name':"Uganda"},
                     {'country_code':"UA", 'name':"Ukraine"},
                     {'country_code':"AE", 'name':"United Arab Emirates"},
                     {'country_code':"GB", 'name':"United Kingdom"},
                     {'country_code':"UM", 'name':"United States Minor Outlying Islands"},
                     {'country_code':"UY", 'name':"Uruguay"},
                     {'country_code':"UZ", 'name':"Uzbekistan"},
                     {'country_code':"VU", 'name':"Vanuatu"},
                     {'country_code':"VE", 'name':"Venezuela, Bolivarian Republic of"},
                     {'country_code':"VN", 'name':"Viet Nam"},
                     {'country_code':"VG", 'name':"Virgin Islands, British"},
                     {'country_code':"VI", 'name':"Virgin Islands, U.S."},
                     {'country_code':"WF", 'name':"Wallis and Futuna"},
                     {'country_code':"EH", 'name':"Western Sahara"},
                     {'country_code':"YE", 'name':"Yemen"},
                     {'country_code':"ZM", 'name':"Zambia"},
                     {'country_code':"ZW", 'name':"Zimbabwe"}

      ]
    }
  }
})();
