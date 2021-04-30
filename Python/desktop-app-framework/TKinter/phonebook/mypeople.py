from tkinter import *
from add_new import AddPeople
import sqlite3


con = sqlite3.connect("people.db")
cur = con.cursor()


class MyPeople(Toplevel):
    def __init__(self):
        Toplevel.__init__(self)
        self.frame()
        # frames
        self.top = Frame(self)
        self.bottom = Frame(self)
        # top frame
        self.phonebook_image = PhotoImage()
        self.phonebook_image_label = Label(self.top)
        # call the frames
        self.top_frame()
        self.bottom_frame()

    def frame(self):
        self.geometry("650x450+100+50")
        self.title("My people")
        self.resizable(False, False)

    def top_frame(self):
        self.top["height"] = 50
        self.top["bg"] = "white"
        self.top.pack(fill=X)
        self.top_frame_components()

    def top_frame_components(self):
        self.place_phonebook_image_label()
        self.place_phonebook_heading()

    def place_phonebook_image_label(self):
        self.phonebook_image["file"] = "images/person.png"
        self.phonebook_image = self.phonebook_image.subsample(4)
        self.phonebook_image_label["image"] = self.phonebook_image
        self.phonebook_image_label["bg"] = "white"
        self.phonebook_image_label.place(x=250, y=10)

    def place_phonebook_heading(self):
        heading = Label(self.top, text="Records", bg="white",
                        font="arial 15 bold")
        heading.place(x=300, y=15)

    def bottom_frame(self):
        self.bottom["height"] = 400
        self.bottom["bg"] = "#34BAEC"
        self.bottom.pack(fill=X)
        self.bottom_frame_components()

    def bottom_frame_components(self):
        self.show_people()
        self.f_add_people_button()
        self.f_update_people_button()
        self.f_delete_people_button()

    def show_people(self):
        people_list = Listbox(self.bottom, width=50, height=20, bg="white")
        scrollbar = Scrollbar(self.bottom, orient=VERTICAL)
        people_list.config(yscrollcommand=scrollbar.set)
        scrollbar.config(command=people_list.yview)
        people_list.grid(row=0, column=0, padx=(10, 0))
        scrollbar.grid(row=0, column=1, sticky=N+S)
        people = cur.execute("SELECT * FROM phonebook").fetchall()
        count = 0
        for person in people:
            people_list.insert(count, person[1])
            count += 1

    def f_add_people_button(self):
        v_add_people_button = Button(self.bottom, text="Add", width=12, command=self.add_people_window)
        v_add_people_button.grid(row=0, column=2, padx=25, pady=10, stick=N)

    def add_people_window(self):
        new_window = AddPeople()
        self.destroy()

    def f_update_people_button(self):
        v_update_people_button = Button(self.bottom, text="Update", width=12)
        v_update_people_button.grid(row=0, column=2, padx=25, pady=60, stick=N)

    def f_delete_people_button(self):
        v_delete_people_button = Button(self.bottom, text="Delete", width=12)
        v_delete_people_button.grid(row=0, column=2, padx=25, pady=110, stick=N)
