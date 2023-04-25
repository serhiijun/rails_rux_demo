class Ui::Mix::Home::Buttons::BlueButtonComponent::BlueButtonComponent < ViewComponent::Base
  def css_class
    self.class.name.underscore.gsub("_", "-").gsub("/", "--").split("--")[0..-2].join("--")
  end

  def call
    Rux.tag("div", { class: css_class, data_controller: css_class, style: "background-color:blue;color:white;padding:10px 20px;border-radius:5px;" }) {
      "Blue Button"
    }
  end
end
