import { BiBody } from "react-icons/bi";
import "./App.css";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import { useState, useEffect, useCallback } from "react";

function App() {
  let [appointmentList, setAppointmentList] = useState([]);
  let [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState("petName");
  let [orderBy, setOrderBy] = useState("asc");
  const filterAppointmentList = appointmentList
    .filter((appointment) => {
      return (
        appointment.petName.toLowerCase().includes(query.toLowerCase()) ||
        appointment.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        appointment.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      let order = orderBy === "asc" ? 1 : -1;

      let valA = a[sortBy].toLowerCase();
      let valB = b[sortBy].toLowerCase();
      return valA < valB ? order * -1 : order * 1;
    });

  const fetchdata = useCallback(() => {
    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments) {
      setAppointmentList(JSON.parse(savedAppointments));
    } else {
      fetch("./data.json")
        .then((response) => response.json())
        .then((data) => {
          setAppointmentList(data);
          localStorage.setItem("appointments", JSON.stringify(data)); // Store initial data
        });
    }
  }, []);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

  return (
    <div className="App Container mx-auto mt-3 font-thin px-10 py-10 mb-5">
      <header className="App-header px-10">
        <h1 className="font-bold bg-red-200 mb-5 rounded-md">
          <BiBody className="inline-block text-red-600 font-bold" /> Your
          Appointments
        </h1>
        <AddAppointment
          lastId={appointmentList.reduce(
            (max, item) => (Number(item.id) > max ? Number(item.id) : max),
            0
          )}
          onSendAppointment={(myAppointment) => {
            const updatedAppointments = [...appointmentList, myAppointment];
            setAppointmentList(updatedAppointments);
            localStorage.setItem(
              "appointments",
              JSON.stringify(updatedAppointments)
            );
          }}
        />
        <Search
          query={query}
          onQueryChange={(myQuery) => setQuery(myQuery)}
          sortBy={sortBy}
          onSortByChange={(mySortBy) => setSortBy(mySortBy)}
          orderBy={orderBy}
          onOrderByChange={(myOrderBy) => setOrderBy(myOrderBy)}
        />
        <ul className="divide-y divide-gray-800">
          {filterAppointmentList.map((appointment) => (
            <AppointmentInfo
              appointment={appointment}
              ondeleteAppointmentMethod={() =>
                setAppointmentList(
                  appointmentList.filter(
                    (appointment) => appointment.deleted !== 1
                  )
                )
              }
              key={appointment.id}
            />
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
