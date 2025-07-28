import axios from "axios";

const API_URL = 'http://localhost:8080/api/foods';

export const fetchFoodList = async() =>{
    try { 
        const response = await axios.get(API_URL);
    //   setFoodList(response.data);
      return response.data;
    }catch(error){
        console.log('Error while fetchimg the food list:', error);
        throw error;
    }

    }

    export const fetchFoodDetail = async(id) =>{
            
            try{
                const response = await axios.get(API_URL+"/"+id);
                return response.data;
            }catch(error){
                console.log("Error while fetching the data" , error);
                throw error;
            }
        }


    

