from tkinter import *
from tkinter import filedialog
from tkinter import messagebox


# class:
class NotePad:
    def __init__(self, master):
        # initiate variables
        self.master = master
        self.text_area = Text(self.master, undo=True, bg="#FFFFFF")
        # variables related to menu
        self.main_menu = Menu()
        self.file_menu = Menu(self.main_menu, tearoff=False)
        self.edit_menu = Menu(self.main_menu, tearoff=False)
        # variables related to files
        self.file_currently_open = None
        # call window definition
        self.define_window()
        # call menu creation
        self.create_menus_in_main_menu()
        # call text area definition
        self.define_text_area()

    def define_window(self):
        self.master.title("Notepad")
        self.master.geometry("1200x600+50+25")
        self.master.config(menu=self.main_menu)
        return

    def create_menus_in_main_menu(self):
        self.define_file_menu()
        self.define_edit_menu()
        return

    def define_file_menu(self):
        self.main_menu.add_cascade(label="File",
                                   menu=self.file_menu)
        # add submenus
        self.file_menu.add_command(label="New",
                                   command=self.create_new_file)
        self.file_menu.add_command(label="Open File",
                                   command=self.open_file)
        self.file_menu.add_separator()
        self.file_menu.add_command(label="Save",
                                   command=self.save_file)
        self.file_menu.add_command(label="Save as",
                                   command=self.save_as_file)
        self.file_menu.add_command(label="Close",
                                   command=self.close_file)
        self.file_menu.add_separator()
        self.file_menu.add_command(label="Exit",
                                   command=self.exit_window)
        return

    def create_new_file(self):
        if self.file_currently_open is not None:
            self.save_file()
        self.text_area.delete(1.0, END)
        self.file_currently_open = None
        return

    def open_file(self):
        working_file = filedialog.askopenfile(initialdir="./media/",
                                              title="Select a file",
                                              filetypes=(("text files", ".txt"),
                                                         ("python", ".py"),
                                                         ("html", ".html"),
                                                         ("All files", ".*")))
        if working_file is not None:
            self.text_area.delete(1.0, END)
            for line in working_file:
                self.text_area.insert(END, line)
            self.file_currently_open = working_file.name
            # name is actually the file path
            working_file.close()
        return

    def save_file(self):
        if self.file_currently_open is None:
            self.save_as_file()
        else:
            working_file = open(self.file_currently_open, "w+")
            working_file.write(self.text_area.get(1.0, END))
            working_file.close()
        return

    def save_as_file(self):
        working_file = filedialog.asksaveasfile(mode="w",
                                                defaultextension=".txt")
        if working_file is not None:
            text_to_save = self.text_area.get(1.0, END)
            working_file.write(text_to_save)
            self.file_currently_open = working_file.name
            working_file.close()
        return

    def close_file(self):
        self.file_currently_open = None
        self.text_area.delete(1.0, END)
        return

    def exit_window(self):
        reply = messagebox.askquestion("Exit", "Do you want to exit")
        if reply == "yes":
            if self.file_currently_open is not None:
                self.save_file()
            self.master.quit()
        return

    def define_edit_menu(self):
        self.main_menu.add_cascade(label="Edit",
                                   menu=self.edit_menu)
        self.edit_menu.add_command(label="Cut",
                                   command=self.cut_text)
        self.edit_menu.add_command(label="Copy",
                                   command=self.copy_text)
        self.edit_menu.add_command(label="Paste",
                                   command=self.paste_text)
        self.edit_menu.add_separator()
        self.edit_menu.add_command(label="Undo",
                                   command=self.text_area.edit_undo)
        self.edit_menu.add_command(label="Redo",
                                   command=self.text_area.edit_redo)
        return

    def cut_text(self):
        self.copy_text()
        self.text_area.delete("sel.first", "sel.last")
        return

    def copy_text(self):
        self.text_area.clipboard_clear()
        self.text_area.clipboard_append(self.text_area.selection_get())
        return

    def paste_text(self):
        self.text_area.insert(INSERT, self.text_area.clipboard_get())
        return

    def define_text_area(self):
        self.text_area.pack(fill=BOTH,
                            expand=1)
        return


# main frame
main_frame = Tk()
pad = NotePad(main_frame)
main_frame.mainloop()
