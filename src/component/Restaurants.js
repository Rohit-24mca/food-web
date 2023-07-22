import React, { useEffect, useState } from "react";
import useGetRestaurants from "../utils/useGetRestaurants";
import { useDispatch, useSelector } from "react-redux";
import { setLongitude, setLatitude } from "./Redux/features/coordsSlice";
import { coordsFetch } from "./Redux/features/coordsSlice";
import Search from "./Search";
import RestaurantCard from "./RestaurantCard";
import { GiHotMeal } from "react-icons/gi";
import { BsFillSuitHeartFill } from "react-icons/bs";
import RestaurantsShimmer from "./RestaurantsShimmer";

const Restaurants = () => {
  const restaurants = useGetRestaurants();

  const dispatch = useDispatch();

  const { latitude, longitude } = useSelector((store) => store.coords);

  const [city, setCity] = useState("");

  function searchRestaurants() {
    dispatch(coordsFetch(city));
    setCity("");
  }

  // fetching current location (latitude and longitude) for fetching restaurants as per the location
  const getCurrCoords = () => {
    if (navigator.geolocation && latitude == null && longitude == null) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(setLatitude(position.coords.latitude));
          dispatch(setLongitude(position.coords.longitude));
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrCoords();
  }, []);

  return (
    <div className="main-scroll-restaurants">
      <div className="flex justify-between flex-col-reverse md:flex-row items-center gap-2 md:px-4 md:pt-3 ">
        <Search
          searchRestaurants={searchRestaurants}
          setCity={setCity}
          city={city}
        />
        <div className="flex items-center gap-2">
          {restaurants && (
            <p className="text-2xl mt-2 font-bold">
              <span className="capitalize">
                {restaurants[0]?.data?.slugs?.city}
              </span>
              &nbsp;Foods
            </p>
          )}

          <GiHotMeal className="text-3xl text-green-700" />
        </div>
      </div>

      {restaurants && restaurants.length > 0 ? (
        <div className=" mt-3 ">
          <div className="grid lg:grid-cols-4 md:grid-cols-2  gap-3 md:gap-2">
            <RestaurantCard restaurants={restaurants} />
          </div>
          <div className="flex justify-center font-medium items-center mt-5 py-2 px-4 mx-auto w-fit text-lg ">
            Made with &nbsp;
            <BsFillSuitHeartFill className="text-green-700" />
            &nbsp; by&nbsp;
            <a
              href="https://github.com/rakhikeshri?tab=repositories"
              className="font-bold"
              target="_blank"
            >
              Rakhi Keshri
            </a>
          </div>
        </div>
      ) : (
        <RestaurantsShimmer />
      )}
    </div>
  );
};

export default Restaurants;

// const restaurantMenu = useGetRestaurantMenu(365622);
