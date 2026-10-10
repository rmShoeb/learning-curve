import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JPanel;

public class Toolbar extends JPanel implements ActionListener{
	private static final long serialVersionUID = 1L;
	
	private JButton helloButton;
	private JButton byeButton;
	private StringListener listener;
	
	public Toolbar() {
		helloButton = new JButton("Hello");
		byeButton = new JButton("Bye");
		
		setBorder(BorderFactory.createBevelBorder(WHEN_FOCUSED));
		setLayout(new FlowLayout());
		
		add(helloButton);
		add(byeButton);
		
		helloButton.addActionListener(this);
		byeButton.addActionListener(this);
	}
	
	public void setStringListener(StringListener listener) {
		this.listener = listener;
	}

	@Override
	public void actionPerformed(ActionEvent event) {
		JButton buttonClicked = (JButton) event.getSource();
		
		if(buttonClicked == helloButton) {
			if(listener != null) {
				listener.StringEmitted("hello\n");
			}
		}
		else if(buttonClicked == byeButton) {
			if(listener != null) {
				listener.StringEmitted("bye\n");
			}
		}
	}
}
