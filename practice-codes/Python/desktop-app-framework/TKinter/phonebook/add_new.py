from tkinter import *
from tkinter import messagebox
import sqlite3

con = sqlite3.connect("people.db")
cur = con.cursor()
label_font = "arial 12 bold"


class AddPeople(Toplevel):
    def __init__(self):
        Toplevel.__init__(self)
        self.frame()
        self.place_components()

    def frame(self):
        self.geometry("350x300+150+100")
        self.title("Add new person")
        self.resizable(False, False)

    def place_components(self):
        self.name_component()
        self.email_component()
        self.phone_component()
        self.address_component()
        self.f_add_button()

    def name_component(self):
        name_label = Label(self, text="Name: ", font=label_font)
        name_label.place(x=20, y=10)
        self.name_entry = Entry(self, width=30, bg="white")
        self.name_entry.place(x=100, y=10)

    def email_component(self):
        email_label = Label(self, text="Email: ", font=label_font)
        email_label.place(x=20, y=40)
        self.email_entry = Entry(self, width=30, bg="white")
        self.email_entry.place(x=100, y=40)

    def phone_component(self):
        phone_label = Label(self, text="Phone: ", font=label_font)
        phone_label.place(x=20, y=70)
        self.phone_entry = Entry(self, width=30, bg="white")
        self.phone_entry.place(x=100, y=70)

    def address_component(self):
        address_label = Label(self, text="Address: ", font=label_font)
        address_label.place(x=20, y=100)
        self.address_entry = Text(self, height=5, width=25, bg="white")
        self.address_entry.place(x=100, y=100)

    def f_add_button(self):
        v_add_button = Button(self, text="Add", width=10, font=label_font,
                              command=self.process_data)
        v_add_button.place(x=125, y=200)

    def process_data(self):
        name = self.name_entry.get()
        email = self.email_entry.get()
        phone = self.phone_entry.get()
        address = self.address_entry.get(1.0, 'end-1c')
        if name and email and phone and address != "":
            try:
                query = "INSERT INTO 'phonebook' ('name', 'email', 'phone_no', 'address') VALUES (?,?,?,?)"
                cur.execute(query, (name, email, phone, address))
                con.commit()
                self.destroy()
                messagebox.showinfo("Saved", "Info Saved")
            except EXCEPTION as e:
                messagebox.showerror("Error", str(e), icon="warning")
        else:
            messagebox.showerror("Error", "Please enter all fields!", icon="warning")