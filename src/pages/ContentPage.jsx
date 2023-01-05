import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase-config"
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";

import NoteCard from "../components/NoteCard";
function ContentPage(){
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const usersCollectionRef = collection(db, "user");
    const queryOrder = query(usersCollectionRef, orderBy("createdAt", 'desc'));
    
    const [usersContent, setUsersContent] = useState([]);
    // const [showForm, setShowForm] = useState(false);



    const signOutHandler = () =>{
        auth.signOut()
          .then(()=>{
              localStorage.clear();
              navigate('/login');
          }
          )
          .catch((error) => console.log(`Error: ${error}`));
      }
      

    const deleteNote = (id) =>{
        const docReference = doc(db, "user", id);
        deleteDoc(docReference);
    }

    useEffect(()=>{

      const getInfo = () =>{
        onSnapshot(queryOrder,(snapshot)=>{
          setUsersContent(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })

      }
      getInfo();
    },[])
      
    return(
        <>
            <div className="md:grid md:grid-cols-parent">
                <Sidebar 
                displayName={user.displayName} 
                signOutHandler={signOutHandler}
                />

                <div 
                className="
                mx-auto
                p-7 mt-5 md:mt-0
                grid 
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-y-16
                gap-x-14
                ">

                {/* add button */}
                <div className="p-5 
                border-2 border-[#6e3820] rounded-3xl
                hidden  
                max-w-[13rem]
                max-h-[13rem]
                cursor-pointer
                active:bg-[#c37f37]
                hover:bg-[#f9cdc0]
                md:flex justify-center
                ">
                    <div className="border-2 rounded-3xl border-dashed border-[#dfb589] flex items-center justify-center p-14">
                        <button className="">
                                <img src="https://img.icons8.com/ios/50/dfb589/plus-math--v1.png"/>
                        </button>
                    </div>
                   
                </div>
                {
                    usersContent.map((item)=>{
                        return(
                            <NoteCard
                                key = {item.id}
                                id = {item.id}
                                title = {item.title}
                                content={item.content}
                                deleteNote={deleteNote}
                            />  
                        )
                    })
                }
                </div>
                
            </div>

        </>
    )
}

export default ContentPage