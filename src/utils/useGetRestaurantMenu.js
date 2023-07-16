import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const useGetRestaurantMenu = (id) => {  
  
  const [data, setData] = useState({
    menu: [],
    restaurantInfo: []
  })

  const { latitude, longitude } = useSelector((store) => store.coords);

  //   fetching menu of restaurant with the obtained latitude, longitude and params id (restaurant id)
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        let restaurantmenu_api = `https://corsproxy.io/?https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${latitude}&lng=${longitude}&restaurantId=${id}&submitAction=ENTER`;

        const response = await axios.get(restaurantmenu_api);

        const newMenu = response.data.data?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards[2]?.card?.card?.itemCards;
        const newRestaurantInfo = response.data.data?.cards[0]?.card?.card?.info;

        setData(prevData => ({
          menu: newMenu || prevData.menu,
          restaurantInfo: newRestaurantInfo || prevData.restaurantInfo
        }));

      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchRestaurants();
  }, [latitude, longitude]);

  return data;
};

export default useGetRestaurantMenu;
