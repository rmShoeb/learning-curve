from tkinter import *
from add_new import AddPeople
import datetime
import funcs

class Phonebook:
    def __init__(self, master):
        self.master = master
        # frames
        self.top = Frame(master)
        self.bottom = Frame(master)
        # top frame
        self.phonebook_image = PhotoImage()
        self.phonebook_image_label = Label(self.top)
        # call the frames
        self.top_frame()
        self.bottom_frame()
    def top_frame(self):
        self.top["height"] = 75
        self.top["bg"] = "white"
        self.top.pack(fill=X)
        self.top_frame_components()
    def top_frame_components(self):
        self.place_phonebook_image_label()
        self.place_phonebook_heading()
        self.place_date()
    def place_phonebook_image_label(self):
        self.phonebook_image["file"] = "images/phonebook.png"
        # self.phonebook_image = self.phonebook_image.zoom(0.1)
        self.phonebook_image = self.phonebook_image.subsample(2)
        self.phonebook_image_label["image"] = self.phonebook_image
        self.phonebook_image_label["bg"] = "white"
        self.phonebook_image_label.place(x=200, y=10)
    def place_phonebook_heading(self):
        heading = Label(self.top, text="Phonebook", bg="white",
                        font="arial 15 bold")
        heading.place(x=300, y=30)

    def place_date(self):
        today = datetime.datetime.now().date()
        date_label = Label(self.top, text=str(today), font="arial 12 bold", bg="white")
        date_label.place(x=650, y=15)

    def bottom_frame(self):
        self.bottom["height"] = 350
        self.bottom["bg"] = "#34BAEB"
        self.bottom.pack(fill=X)
        self.bottom_frame_components()

    def bottom_frame_components(self):
        self.place_add_people()
        self.place_view_people()
        self.place_about_us()

    def place_add_people(self):
        add_people_button = Button(self.bottom, text="Add people", font="arial 12", width=15,
                                   command=self.add_people_window)
        add_people_button.place(x=100, y=25)

    def add_people_window(self):
        new_window = AddPeople()
    def place_view_people(self):
        view_people_button = Button(self.bottom, text="View people", font="arial 12", width=15,
                                    command=funcs.my_people)
        view_people_button.place(x=100, y=75)

    def place_about_us(self):
        about_us_button = Button(self.bottom, text="About Us", font="arial 12", width=15)
        about_us_button.place(x=100, y=125)
