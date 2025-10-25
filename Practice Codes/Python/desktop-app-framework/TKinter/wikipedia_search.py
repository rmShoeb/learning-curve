from tkinter import *
import wikipedia


def get_search_value():
    search_value = search_box_entry.get()
    search_result_textbox.delete(1.0, END)
    try:
        summary = wikipedia.summary(search_value)
    except:
        summary = "Error"
    search_result_textbox.insert(INSERT, summary)
    return


# main frame
main_frame = Tk()
# main_frame.geometry("450x600")

# frame declarations
search_frame = Frame(main_frame)
search_result_frame = Frame(main_frame)

# search frame components
search_box_entry = Entry(search_frame)
search_button = Button(search_frame, text="Search", command=get_search_value)
search_box_entry.grid()
search_button.grid()

# search result components
search_result_scroll_bar = Scrollbar(search_result_frame)
search_result_textbox = Text(search_result_frame, width=100, height=25,
                             yscrollcommand=search_result_scroll_bar.set, wrap=WORD)
search_result_textbox.pack(side=LEFT)
search_result_scroll_bar.pack(side=RIGHT, fill=Y)
search_result_scroll_bar.config(command=search_result_textbox.yview)

# place the frames
search_frame.grid()
search_result_frame.grid()

main_frame.mainloop()
