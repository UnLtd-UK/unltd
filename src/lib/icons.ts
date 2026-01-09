/**
 * Central icon registry - only import the icons actually used in the project
 * This dramatically improves build times vs star imports
 */

import { library } from "@fortawesome/fontawesome-svg-core";

// Solid icons
import {
    faArrowDown,
    faArrowRight,
    faArrowUp,
    faArrowUpRightFromSquare,
    faArrowsRotate,
    faAward,
    faBagShopping,
    faBars,
<<<<<<< HEAD
<<<<<<< HEAD
    faBenchTree,
    faBook,
    faBookOpen,
    faBooks,
    faClipboardList,
    faGlobe,
    faLink,
    faLock,
    faPlay,
=======
=======
    faBenchTree,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faBook,
    faBooks,
>>>>>>> 729c08b (Refactor icon usage across the application)
    faBriefcase,
    faBuilding,
    faCalendarCheck,
    faCalendarClock,
    faCalendarDay,
    faCalendarDays,
    faCalendarPlus,
    faCertificate,
    faChartLine,
    faCheck,
<<<<<<< HEAD
    faChessPawn,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
    faChevronDown,
    faChevronRight,
    faChevronUp,
    faCircle,
    faCircleCheck,
    faCircleInfo,
    faCircleXmark,
    faClipboardCheck,
    faClock,
    faCodeBranch,
    faCoins,
    faComments,
    faDisplayChartUp,
    faDoorClosed,
    faDoorOpen,
    faDownload,
    faDragon,
<<<<<<< HEAD
<<<<<<< HEAD
    faEarthEurope,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faEarthEurope,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faEllipsis,
    faEnvelope,
    faEnvelopeCircleCheck,
    faEnvelopeOpenText,
    faEye,
    faFileCircleCheck,
    faFileLines,
    faFingerprint,
    faGavel,
    faHammer,
    faHandHoldingHeart,
    faHandsHelping,
    faHandsHoldingHeart,
    faHandshake,
    faHeart,
    faHeartPulse,
    faHourglass,
<<<<<<< HEAD
    faHourglassHalf,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
    faHouse,
    faImageSlash,
    faInfoCircle,
    faLandmark,
    faLaptop,
    faLightbulb,
<<<<<<< HEAD
<<<<<<< HEAD
    faLightbulbOn,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faLightbulbOn,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faList,
    faLocationDot,
    faMagnifyingGlass,
    faMagnifyingGlassChart,
    faMap,
    faMessages,
    faMinus,
    faNewspaper,
    faPaperPlane,
    faPartyHorn,
    faPenNib,
    faPenToSquare,
    faPeopleGroup,
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faPersonRunningFast,
    faPhone,
    faPoliceBox,
    faPiggyBank,
    faPuzzlePiece,
=======
    faPhone,
>>>>>>> 729c08b (Refactor icon usage across the application)
    faQuestion,
    faQuoteLeft,
    faRobot,
    faRocket,
<<<<<<< HEAD
<<<<<<< HEAD
    faRocketLaunch,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faRocketLaunch,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faShieldHalved,
    faSparkles,
    faSpinner,
    faStar,
    faSterlingSign,
    faStreetView,
    faTable,
    faTag,
    faTriangleExclamation,
    faUniversalAccess,
    faUpRightFromSquare,
    faUser,
    faUserShield,
    faUsers,
    faVideo,
    faXmark,
} from "@awesome.me/kit-0ff725f684/icons/classic/solid";

// Regular icons
import {
    faArrowDown as farArrowDown,
    faArrowRight as farArrowRight,
    faArrowUpRightFromSquare as farArrowUpRightFromSquare,
<<<<<<< HEAD
<<<<<<< HEAD
    faAward as farAward,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faAward as farAward,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faCalendar as farCalendar,
    faCalendarClock as farCalendarClock,
    faCalendarDays as farCalendarDays,
    faCircleCheck as farCircleCheck,
    faCircleQuestion as farCircleQuestion,
    faClock as farClock,
    faClipboardListCheck as farClipboardListCheck,
    faEnvelope as farEnvelope,
    faGlobe as farGlobe,
<<<<<<< HEAD
<<<<<<< HEAD
    faHandshake as farHandshake,
    faLightbulb as farLightbulb,
    faMagnifyingGlass as farMagnifyingGlass,
    faMessagesQuestion as farMessagesQuestion,
    faPeopleRoof as farPeopleRoof,
=======
=======
    faHandshake as farHandshake,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faLightbulb as farLightbulb,
    faMagnifyingGlass as farMagnifyingGlass,
    faMessagesQuestion as farMessagesQuestion,
<<<<<<< HEAD
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faPeopleRoof as farPeopleRoof,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faPresentationScreen as farPresentationScreen,
    faRoute as farRoute,
    faSparkles as farSparkles,
    faTrophyStar as farTrophyStar,
} from "@awesome.me/kit-0ff725f684/icons/classic/regular";

// Brand icons
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
import {
    faBluesky,
    faInstagram,
    faLinkedin,
    faYoutube,
} from "@awesome.me/kit-0ff725f684/icons/classic/brands";
<<<<<<< HEAD
=======
import { faLinkedin } from "@awesome.me/kit-0ff725f684/icons/classic/brands";
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)

// Light icons
import {
    faBagShopping as falBagShopping,
    faCheck as falCheck,
    faDisplayChartUp as falDisplayChartUp,
    faHandshake as falHandshake,
    faHeart as falHeart,
    faPenNib as falPenNib,
    faPeopleGroup as falPeopleGroup,
    faRectanglePro as falRectanglePro,
    faTimer as falTimer,
    faUserHeadset as falUserHeadset,
} from "@awesome.me/kit-0ff725f684/icons/classic/light";

// Thin icons
import {
    faLayerGroup as fatLayerGroup,
    faLocationDot as fatLocationDot,
    faSeedling as fatSeedling,
    faSpinner as fatSpinner,
} from "@awesome.me/kit-0ff725f684/icons/classic/thin";

// Sharp solid icons
import {
    faCircleCheck as fassCircleCheck,
    faCircleXmark as fassCircleXmark,
} from "@awesome.me/kit-0ff725f684/icons/sharp/solid";

// Register all icons with the library
library.add(
    // Solid
    faArrowDown,
    faArrowRight,
    faArrowUp,
    faArrowUpRightFromSquare,
    faArrowsRotate,
    faAward,
    faBagShopping,
    faBars,
<<<<<<< HEAD
<<<<<<< HEAD
    faBenchTree,
    faBook,
    faBookOpen,
    faBooks,
    faClipboardList,
    faGlobe,
    faLink,
    faLock,
    faPlay,
=======
=======
    faBenchTree,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faBook,
    faBooks,
>>>>>>> 729c08b (Refactor icon usage across the application)
    faBriefcase,
    faBuilding,
    faCalendarCheck,
    faCalendarClock,
    faCalendarDay,
    faCalendarDays,
    faCalendarPlus,
    faCertificate,
    faChartLine,
    faCheck,
<<<<<<< HEAD
    faChessPawn,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
    faChevronDown,
    faChevronRight,
    faChevronUp,
    faCircle,
    faCircleCheck,
    faCircleInfo,
    faCircleXmark,
    faClipboardCheck,
    faClock,
    faCodeBranch,
    faCoins,
    faComments,
    faDisplayChartUp,
    faDoorClosed,
    faDoorOpen,
    faDownload,
    faDragon,
<<<<<<< HEAD
<<<<<<< HEAD
    faEarthEurope,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faEarthEurope,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faEllipsis,
    faEnvelope,
    faEnvelopeCircleCheck,
    faEnvelopeOpenText,
    faEye,
    faFileCircleCheck,
    faFileLines,
    faFingerprint,
    faGavel,
    faHammer,
    faHandHoldingHeart,
    faHandsHelping,
    faHandsHoldingHeart,
    faHandshake,
    faHeart,
    faHeartPulse,
    faHourglass,
<<<<<<< HEAD
    faHourglassHalf,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
    faHouse,
    faImageSlash,
    faInfoCircle,
    faLandmark,
    faLaptop,
    faLightbulb,
<<<<<<< HEAD
<<<<<<< HEAD
    faLightbulbOn,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faLightbulbOn,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faList,
    faLocationDot,
    faMagnifyingGlass,
    faMagnifyingGlassChart,
    faMap,
    faMessages,
    faMinus,
    faNewspaper,
    faPaperPlane,
    faPartyHorn,
    faPenNib,
    faPenToSquare,
    faPeopleGroup,
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faPersonRunningFast,
    faPhone,
    faPiggyBank,
    faPuzzlePiece,
=======
    faPhone,
>>>>>>> 729c08b (Refactor icon usage across the application)
    faQuestion,
    faQuoteLeft,
    faRobot,
    faRocket,
<<<<<<< HEAD
<<<<<<< HEAD
    faRocketLaunch,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faRocketLaunch,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faShieldHalved,
    faSparkles,
    faSpinner,
    faStar,
    faSterlingSign,
    faStreetView,
    faTable,
    faTag,
    faTriangleExclamation,
    faUniversalAccess,
    faUpRightFromSquare,
    faUser,
    faUserShield,
    faUsers,
    faVideo,
    faXmark,
    // Regular
    farArrowDown,
    farArrowRight,
    farArrowUpRightFromSquare,
<<<<<<< HEAD
<<<<<<< HEAD
    farAward,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    farAward,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    farCalendar,
    farCalendarClock,
    farCalendarDays,
    farCircleCheck,
    farCircleQuestion,
    farClock,
    farClipboardListCheck,
    farEnvelope,
    farGlobe,
<<<<<<< HEAD
<<<<<<< HEAD
    farHandshake,
    farLightbulb,
    farMagnifyingGlass,
    farMessagesQuestion,
    farPeopleRoof,
=======
=======
    farHandshake,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    farLightbulb,
    farMagnifyingGlass,
    farMessagesQuestion,
<<<<<<< HEAD
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    farPeopleRoof,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    farPresentationScreen,
    farRoute,
    farSparkles,
    farTrophyStar,
    // Brands
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faBluesky,
    faInstagram,
    faLinkedin,
    faYoutube,
<<<<<<< HEAD
=======
    faLinkedin,
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    // Light
    falBagShopping,
    falCheck,
    falDisplayChartUp,
    falHandshake,
    falHeart,
    falPenNib,
    falPeopleGroup,
    falRectanglePro,
    falTimer,
    falUserHeadset,
    // Thin
    fatLayerGroup,
    fatLocationDot,
    fatSeedling,
    fatSpinner,
    // Sharp solid
    fassCircleCheck,
<<<<<<< HEAD
    fassCircleXmark,
    // Solid (police-box)
    faPoliceBox
=======
    fassCircleXmark
>>>>>>> 729c08b (Refactor icon usage across the application)
);

// Export for direct usage
export {
    // Solid
    faArrowDown,
    faArrowRight,
    faArrowUp,
    faArrowUpRightFromSquare,
    faArrowsRotate,
    faAward,
    faBagShopping,
    faBars,
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faBenchTree,
    faBook,
    faBooks,
    faClipboardList,
    faLock,
=======
    faBook,
    faBooks,
>>>>>>> 729c08b (Refactor icon usage across the application)
    faBriefcase,
    faBuilding,
    faCalendarCheck,
    faCalendarClock,
    faCalendarDay,
    faCalendarDays,
    faCalendarPlus,
    faCertificate,
    faChartLine,
    faCheck,
<<<<<<< HEAD
    faChessPawn,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
    faChevronDown,
    faChevronRight,
    faChevronUp,
    faCircle,
    faCircleCheck,
    faCircleInfo,
    faCircleXmark,
    faClipboardCheck,
    faClock,
    faCodeBranch,
    faCoins,
    faComments,
    faDisplayChartUp,
    faDoorClosed,
    faDoorOpen,
    faDownload,
    faDragon,
<<<<<<< HEAD
<<<<<<< HEAD
    faEarthEurope,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faEarthEurope,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faEllipsis,
    faEnvelope,
    faEnvelopeCircleCheck,
    faEnvelopeOpenText,
    faEye,
    faFileCircleCheck,
    faFileLines,
    faFingerprint,
    faGavel,
    faHammer,
    faHandHoldingHeart,
    faHandsHelping,
    faHandsHoldingHeart,
    faHandshake,
    faHeart,
    faHeartPulse,
    faHourglass,
<<<<<<< HEAD
    faHourglassHalf,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
    faHouse,
    faImageSlash,
    faInfoCircle,
    faLandmark,
    faLaptop,
    faLightbulb,
<<<<<<< HEAD
<<<<<<< HEAD
    faLightbulbOn,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faLightbulbOn,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faList,
    faLocationDot,
    faMagnifyingGlass,
    faMagnifyingGlassChart,
    faMap,
    faMessages,
    faMinus,
    faNewspaper,
    faPaperPlane,
    faPartyHorn,
    faPenNib,
    faPenToSquare,
    faPeopleGroup,
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faPersonRunningFast,
    faPhone,
    faPiggyBank,
    faPuzzlePiece,
=======
    faPhone,
>>>>>>> 729c08b (Refactor icon usage across the application)
    faQuestion,
    faQuoteLeft,
    faRobot,
    faRocket,
<<<<<<< HEAD
<<<<<<< HEAD
    faRocketLaunch,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    faRocketLaunch,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faShieldHalved,
    faSparkles,
    faSpinner,
    faStar,
    faSterlingSign,
    faStreetView,
    faTable,
    faTag,
    faTriangleExclamation,
    faUniversalAccess,
    faUpRightFromSquare,
    faUser,
    faUserShield,
    faUsers,
    faVideo,
    faXmark,
    // Regular
    farArrowDown,
    farArrowRight,
    farArrowUpRightFromSquare,
<<<<<<< HEAD
<<<<<<< HEAD
    farAward,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    farAward,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    farCalendar,
    farCalendarClock,
    farCalendarDays,
    farCircleCheck,
    farCircleQuestion,
    farClock,
    farClipboardListCheck,
    farEnvelope,
    farGlobe,
<<<<<<< HEAD
<<<<<<< HEAD
    farHandshake,
    farLightbulb,
    farMagnifyingGlass,
    farMessagesQuestion,
    farPeopleRoof,
=======
=======
    farHandshake,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    farLightbulb,
    farMagnifyingGlass,
    farMessagesQuestion,
<<<<<<< HEAD
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
    farPeopleRoof,
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    farPresentationScreen,
    farRoute,
    farSparkles,
    farTrophyStar,
    // Brands
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    faBluesky,
    faInstagram,
    faLinkedin,
    faYoutube,
<<<<<<< HEAD
=======
    faLinkedin,
>>>>>>> 729c08b (Refactor icon usage across the application)
=======
>>>>>>> adda23e (feat: Integrate DynamicIcon component for Font Awesome icons and refactor existing icon usage)
    // Light
    falBagShopping,
    falCheck,
    falDisplayChartUp,
    falHandshake,
    falHeart,
    falPenNib,
    falPeopleGroup,
    falRectanglePro,
    falTimer,
    falUserHeadset,
    // Thin
    fatLayerGroup,
    fatLocationDot,
    fatSeedling,
    fatSpinner,
    // Sharp solid
    fassCircleCheck,
    fassCircleXmark,
<<<<<<< HEAD
    // Solid (police-box)
    faPoliceBox,
=======
>>>>>>> 729c08b (Refactor icon usage across the application)
};
