from tkinter import *
from phonebook import Phonebook


def main():
    main_frame = Tk()
    main_frame.title("Phonebook")
    main_frame.geometry("750x450+50+50")
    main_frame.resizable(False, False)
    app = Phonebook(main_frame)
    main_frame.mainloop()


if __name__ == '__main__':
    main()
