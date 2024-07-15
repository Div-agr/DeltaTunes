import { RiPlayListLine } from "react-icons/ri";
import { FaChartSimple, FaUsers } from "react-icons/fa6";
import { GiMusicalNotes } from "react-icons/gi";
import { FaHeadphones } from "react-icons/fa";

const MenuList = [
    {
        id: 1,
        icon: <RiPlayListLine/>,
        name:"Playlists",
        route: "/playlists"
    },
    {
        id: 2,
        icon: <FaChartSimple/>,
        name:"Charts",
        route: "/charts"
    },
    {
        id: 3,
        icon: <FaUsers/>,
        name:"Friends",
        route: "/friends"
    },
    {
        id: 4,
        icon: <GiMusicalNotes/>,
        name:"Party Mode",
        route:"/party"
    },
]

export {MenuList}