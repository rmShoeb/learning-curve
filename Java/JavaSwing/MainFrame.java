import javax.swing.JButton;	
import javax.swing.JFrame;

import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class MainFrame extends JFrame{
    private static final long serialVersionUID = 1L;

    private TextPanel 	textPanel;
    private JButton 	btn;
    private Toolbar 	toolbar;
    private FormPanel 	formPanel;

    public MainFrame() {
        super("Hello World");
        setLayout(new BorderLayout());

        textPanel 	= new TextPanel();
        toolbar 	= new Toolbar();
        btn 		= new JButton("Click");
        formPanel 	= new FormPanel();
        
        toolbar.setStringListener(new StringListener() {
			@Override
			public void StringEmitted(String str) {
				textPanel.appendText(str);
			}
        });
        
        btn.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent arg0) {
				textPanel.appendText("button click\n");
			}
        });
        
        formPanel.setFormListener(new FormListener() {
			@Override
			public void formEventOccured(FormEvent e) {
				textPanel.appendText("name: " + e.getName() + "\noccupation: " + e.getOccupation() + "\nAge: " + e.getAge() + "\n");
			}
        	
        });

        add(toolbar, BorderLayout.NORTH);
        add(formPanel, BorderLayout.WEST);
        add(textPanel, BorderLayout.CENTER);
        add(btn, BorderLayout.PAGE_END);

        setSize(750, 750);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
    }
}